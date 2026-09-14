import express from 'express';
import helmet from 'helmet';
import { rateLimit } from 'express-rate-limit';
import multer from 'multer';
import path from 'node:path';
import { mkdir, writeFile, rm } from 'node:fs/promises';
import { randomUUID } from 'node:crypto';

const categories = ['construction', 'corporate', 'industrial', 'specialist', 'events', 'multiple'];
const limits = {
  fullName: 120,
  company: 160,
  email: 254,
  phone: 30,
  description: 10000,
  location: 200,
  completionDate: 10,
};
const allowedExtensions = new Set(['.pdf', '.docx', '.xlsx', '.jpg', '.jpeg', '.png']);
function validFile(file) {
  const ext = path.extname(file.originalname).toLowerCase();
  const hex = file.buffer.subarray(0, 8).toString('hex');
  if (ext === '.pdf') return file.buffer.subarray(0, 5).toString() === '%PDF-';
  if (ext === '.png') return hex === '89504e470d0a1a0a';
  if (ext === '.jpg' || ext === '.jpeg') return hex.startsWith('ffd8ff');
  return (ext === '.docx' || ext === '.xlsx') && hex.startsWith('504b0304');
}
export function createApp({
  dataDir = process.env.DATA_DIR || path.resolve('.data/enquiries'),
  serveStatic = true,
  limit = 15,
} = {}) {
  const app = express();
  app.disable('x-powered-by');
  // Set TRUST_PROXY to the known number of reverse proxies in your deployment.
  if (process.env.TRUST_PROXY) app.set('trust proxy', Number(process.env.TRUST_PROXY));
  app.use(
    helmet({
      contentSecurityPolicy: {
        directives: {
          defaultSrc: ["'self'"],
          scriptSrc: ["'self'"],
          styleSrc: ["'self'", "'unsafe-inline'"],
          imgSrc: ["'self'", 'data:'],
          fontSrc: ["'self'"],
          connectSrc: ["'self'"],
          frameSrc: ['https://maps.google.com'],
          upgradeInsecureRequests: process.env.NODE_ENV === 'production' ? [] : null,
        },
      },
    }),
  );
  const upload = multer({
    storage: multer.memoryStorage(),
    limits: { fileSize: 10 * 1024 * 1024, files: 3, fields: 15, fieldSize: 20000, parts: 19 },
    fileFilter: (_req, file, done) => {
      if (!allowedExtensions.has(path.extname(file.originalname).toLowerCase()))
        return done(new Error('Use PDF, DOCX, XLSX, JPG or PNG attachments.'));
      done(null, true);
    },
  });
  app.get('/api/health', (_req, res) => res.json({ ok: true }));
  app.post(
    '/api/enquiries',
    rateLimit({
      windowMs: 15 * 60 * 1000,
      limit,
      standardHeaders: 'draft-8',
      legacyHeaders: false,
      message: { error: 'Too many enquiries. Please try again in 15 minutes.' },
    }),
    upload.array('documents', 3),
    async (req, res, next) => {
      try {
        const body = req.body || {};
        if (body.website) return res.status(400).json({ error: 'Unable to accept this enquiry.' });
        if (!['quote', 'contact'].includes(body.kind))
          return res.status(400).json({ error: 'Please choose a valid enquiry type.' });
        const fields = Object.fromEntries(
          Object.entries(limits).map(([name]) => [
            name,
            typeof body[name] === 'string' ? body[name].trim() : '',
          ]),
        );
        for (const [name, max] of Object.entries(limits))
          if (fields[name].length > max)
            return res.status(400).json({ error: `The ${name} field is too long.` });
        if (
          !fields.fullName ||
          !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(fields.email) ||
          fields.description.length < 10
        )
          return res
            .status(400)
            .json({
              error:
                'Provide your name, a valid email address and a description of at least 10 characters.',
            });
        if (body.consent !== 'on')
          return res
            .status(400)
            .json({ error: 'Please agree to the use of your details to respond to this enquiry.' });
        if (
          body.kind === 'quote' &&
          (!categories.includes(body.service) ||
            !fields.location ||
            !/^[+\d\s().-]{7,30}$/.test(fields.phone) ||
            fields.phone.replace(/\D/g, '').length < 7)
        )
          return res
            .status(400)
            .json({
              error: 'Choose a service and provide a valid phone number and project location.',
            });
        if (fields.completionDate) {
          const date = new Date(`${fields.completionDate}T12:00:00Z`);
          const today = new Intl.DateTimeFormat('en-CA', {
            timeZone: 'Africa/Johannesburg',
          }).format(new Date());
          if (
            !/^\d{4}-\d{2}-\d{2}$/.test(fields.completionDate) ||
            Number.isNaN(date.getTime()) ||
            date.toISOString().slice(0, 10) !== fields.completionDate ||
            fields.completionDate < today
          )
            return res
              .status(400)
              .json({ error: 'Choose a valid completion date of today or later.' });
        }
        const files = req.files || [];
        if (files.some((file) => !validFile(file)))
          return res
            .status(400)
            .json({
              error:
                'An attachment does not match its file type. Please upload a valid document or image.',
            });
        const id = randomUUID();
        const reference = `RYN-${id.slice(0, 8).toUpperCase()}`;
        const target = path.join(path.resolve(dataDir), id);
        await mkdir(target, { recursive: true });
        try {
          const attachments = [];
          for (const [i, file] of files.entries()) {
            const storedName = `${i + 1}${path.extname(file.originalname).toLowerCase()}`;
            await writeFile(path.join(target, storedName), file.buffer, {
              flag: 'wx',
              mode: 0o600,
            });
            attachments.push({
              originalName: path.basename(file.originalname),
              storedName,
              size: file.size,
            });
          }
          await writeFile(
            path.join(target, 'enquiry.json'),
            JSON.stringify(
              {
                id,
                reference,
                receivedAt: new Date().toISOString(),
                kind: body.kind,
                ...fields,
                service: body.kind === 'quote' ? body.service : null,
                consent: true,
                attachments,
              },
              null,
              2,
            ),
            { flag: 'wx', mode: 0o600 },
          );
        } catch (error) {
          await rm(target, { recursive: true, force: true });
          throw error;
        }
        res.status(201).json({ reference });
      } catch (error) {
        next(error);
      }
    },
  );
  app.use('/api', (_req, res) => res.status(404).json({ error: 'API endpoint not found.' }));
  if (serveStatic) {
    const dist = path.resolve('dist');
    app.use(express.static(dist, { index: false, maxAge: '1h' }));
    app.get(['/', '/request-a-quote', '/privacy'], (_req, res) =>
      res.sendFile(path.join(dist, 'index.html')),
    );
    app.use((_req, res) => res.status(404).sendFile(path.join(dist, 'index.html')));
  }
  app.use((error, _req, res, _next) => {
    if (error instanceof multer.MulterError)
      return res
        .status(400)
        .json({
          error:
            error.code === 'LIMIT_FILE_SIZE'
              ? 'Each attachment must be 10 MB or smaller.'
              : 'Upload up to 3 files and check the form field limits.',
        });
    if (error.message === 'Use PDF, DOCX, XLSX, JPG or PNG attachments.')
      return res.status(400).json({ error: error.message });
    console.error('Enquiry storage failed:', error.code || error.name);
    res.status(500).json({ error: 'Your enquiry could not be saved. Please try again shortly.' });
  });
  return app;
}
