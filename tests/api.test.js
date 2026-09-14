import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp, readdir, readFile, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { createApp } from '../server/app.js';

async function withServer(run, options = {}) {
  const dataDir = await mkdtemp(path.join(tmpdir(), 'rayoni-api-test-'));
  const server = createApp({ dataDir, serveStatic: false, ...options }).listen(0, '127.0.0.1');
  await new Promise((resolve) => server.once('listening', resolve));
  const url = `http://127.0.0.1:${server.address().port}/api/enquiries`;
  try {
    await run(url, dataDir);
  } finally {
    await new Promise((resolve) => server.close(resolve));
    await rm(dataDir, { recursive: true, force: true });
  }
}
const fields = {
  kind: 'quote',
  fullName: 'Test Client',
  company: 'Test Organisation',
  email: 'test@example.com',
  phone: '+27 11 555 0100',
  service: 'construction',
  description: 'A test request for roof maintenance.',
  location: 'Westonaria',
  consent: 'on',
};
function form(overrides = {}) {
  const data = new FormData();
  for (const [key, value] of Object.entries({ ...fields, ...overrides })) data.set(key, value);
  return data;
}
test('persists a complete quotation and its attachment, returning a reference', () =>
  withServer(async (url, dir) => {
    const data = form();
    data.append('documents', new Blob(['%PDF-1.4\nTest drawing']), 'drawing.pdf');
    const response = await fetch(url, { method: 'POST', body: data });
    assert.equal(response.status, 201);
    const result = await response.json();
    assert.match(result.reference, /^RYN-[A-F0-9]{8}$/);
    const [id] = await readdir(dir);
    const stored = JSON.parse(await readFile(path.join(dir, id, 'enquiry.json')));
    assert.equal(stored.reference, result.reference);
    assert.equal(stored.email, fields.email);
    assert.equal(stored.attachments[0].originalName, 'drawing.pdf');
    assert.equal(await readFile(path.join(dir, id, '1.pdf'), 'utf8'), '%PDF-1.4\nTest drawing');
  }));
test('accepts a contact enquiry without quotation-specific fields', () =>
  withServer(async (url) => {
    const response = await fetch(url, {
      method: 'POST',
      body: form({ kind: 'contact', phone: '', service: '', location: '' }),
    });
    assert.equal(response.status, 201);
  }));
test('rejects invalid data, missing consent, invalid dates and spam without saving', () =>
  withServer(async (url, dir) => {
    for (const invalid of [
      { email: 'invalid' },
      { consent: '' },
      { service: 'unknown' },
      { description: 'short' },
      { phone: 'nope123' },
      { fullName: ' ' },
      { website: 'spam' },
      { completionDate: '2020-01-01' },
      { completionDate: '2099-02-31' },
    ]) {
      const response = await fetch(url, { method: 'POST', body: form(invalid) });
      assert.equal(response.status, 400, JSON.stringify(invalid));
    }
    assert.equal((await readdir(dir)).length, 0);
  }));
test('rejects disguised, disallowed and excessive attachments', () =>
  withServer(async (url, dir) => {
    const disguised = form();
    disguised.append('documents', new Blob(['executable bytes']), 'fake.pdf');
    assert.equal((await fetch(url, { method: 'POST', body: disguised })).status, 400);
    const bad = form();
    bad.append('documents', new Blob(['test']), 'file.exe');
    assert.equal((await fetch(url, { method: 'POST', body: bad })).status, 400);
    const many = form();
    for (let i = 0; i < 4; i++) many.append('documents', new Blob(['%PDF-1.4']), `file${i}.pdf`);
    assert.equal((await fetch(url, { method: 'POST', body: many })).status, 400);
    assert.equal((await readdir(dir)).length, 0);
  }));
test('limits repeated submissions with a useful error response', () =>
  withServer(
    async (url) => {
      assert.equal((await fetch(url, { method: 'POST', body: form() })).status, 201);
      const response = await fetch(url, { method: 'POST', body: form() });
      assert.equal(response.status, 429);
      assert.match((await response.json()).error, /15 minutes/);
    },
    { limit: 1 },
  ));
