import { readdir, readFile } from 'node:fs/promises';
import path from 'node:path';
const root = path.resolve(process.env.DATA_DIR || '.data/enquiries');
try {
  const entries = await readdir(root, { withFileTypes: true });
  const enquiries = [];
  for (const entry of entries.filter((e) => e.isDirectory())) {
    try {
      const enquiry = JSON.parse(
        await readFile(path.join(root, entry.name, 'enquiry.json'), 'utf8'),
      );
      enquiries.push({
        reference: enquiry.reference,
        received: enquiry.receivedAt,
        type: enquiry.kind,
        name: enquiry.fullName,
        email: enquiry.email,
        service: enquiry.service,
        files: enquiry.attachments.length,
      });
    } catch {
      /* Ignore incomplete records. */
    }
  }
  console.table(enquiries.sort((a, b) => b.received.localeCompare(a.received)));
} catch (error) {
  if (error.code === 'ENOENT') console.log('No enquiries yet.');
  else throw error;
}
