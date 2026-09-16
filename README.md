# RAYONI

A responsive construction and supply website built with React, TypeScript and Vite, with an Express enquiry API. The design uses the supplied Rayoni logo, warm white, charcoal and gold. All company facts come from the supplied brief; missing facts are explicitly pending.

Live Demo: https://rayoni.vercel.app

## Run locally

Requires Node.js 22.12+ (tested on Node 24).

```sh
npm install
npm run dev
```

Open http://localhost:5173. Vite proxies form requests to the API on port 3001.

```sh
npm run build
npm start
```

The production server serves the built website and API at http://localhost:3001. Set `PORT` to override it.

## Content and brand

- `src/content.ts`: service categories, company contact details, team, credentials and typed project records. Add verified records to replace placeholders. `phone`, `email`, `address`, `hours` and `whatsapp` are intentionally unset.
- `src/App.tsx`: page sections, reusable team component, service cards, contact and quotation forms.
- `src/styles.css` and `src/responsive.css`: brand styling and desktop/tablet/mobile layouts.
- `public/images/rayoni-logo.png`: original supplied artwork, displayed using a CSS crop without modifying the source.
- The home, quotation and privacy pages have direct URLs. Unknown URLs return a 404 page.

## Enquiries and attachments

Both forms submit to `POST /api/enquiries`. The server validates required fields, consent, dates, service categories and uploads before persisting a submission. Successful responses include a `RYN-…` reference. Failed requests keep the form contents for retry. Up to three PDF, DOCX, XLSX, JPG or PNG attachments are accepted, each up to 10 MB. File extensions and leading file signatures are checked; this is not an antivirus scanner.

Enquiries are stored in `.data/enquiries/<uuid>/enquiry.json` with their attachments in the same private directory. This directory is never served by the web server and is excluded from Git. To review the submission index locally:

```sh
node server/list-enquiries.js
```

Use `DATA_DIR` to point to persistent private storage in hosting. There is no email notification service configured, and no public admin endpoint. The site's success message confirms storage, not email delivery. Configure a verified mailbox and delivery integration if email notifications are needed. Set `TRUST_PROXY` only to the known count of reverse proxies if deployed behind one. `NODE_ENV=production` enables the HTTPS CSP directive.

Before public launch, supply verified contact information, privacy contact and retention policy, registration/CIDB details and any portfolio records or certificates to be published. Host using HTTPS and persistent storage, arrange internal enquiry review and backups, and choose an attachment scanning service for public upload handling. No clients, completed projects, certificates or registration numbers have been fabricated.

## Verification

```sh
npm test
npm run build
npm run test:e2e
```

Browser tests use installed Microsoft Edge, exercise quote uploads, contact submission, error recovery, mobile navigation, overflow and axe accessibility checks. Test enquiries use `.data/browser-test-enquiries` when Playwright starts its own server. Screenshots are written to `test-results/`. For another browser, update `channel` in `playwright.config.ts`.

## Image sources

Photography is illustrative; it is not presented as Rayoni's completed work or team.

- Architecture: https://images.unsplash.com/photo-1486406146926-c627a92ad1ab
- Construction: https://images.unsplash.com/photo-1541888946425-d81bb19240f5
- Planning: https://images.unsplash.com/photo-1503387762-592deb58ef4e

Photos and Manrope font files are served locally. Google Maps loads only after the visitor chooses to view the area map; it shows Westonaria generally, not a claimed office address.
