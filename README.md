# Lena Cherchenko — QA Engineer CV

The English CV has two layouts with the same content:

- `public/index.html`: designed CV with a photo, one A4 page.
- `public/ats.html`: single-column CV without a photo, two A4 pages.

Edit `cv-content.json` to update both versions. Layout styles are in
`public/style.css` and `public/ats.css`. The original photo is preserved;
the designed CV uses `public/photo-optimized.jpg`.

```sh
npm run build:cv
npm run dev
```

Open `http://localhost:3000` or `http://localhost:3000/ats.html` to review.

For reproducible PDFs using the installed Puppeteer browser:

```sh
npm run export:pdf
```

This rebuilds the HTML and writes `CV_LCherchenko_QA_Designed.pdf` and
`CV_LCherchenko_QA_ATS.pdf` in the project root. `cv.pdf` is a copy of the
designed PDF; refresh it after exporting if that filename is needed.

The Save as PDF button opens the browser print dialog. Select A4, 100% scale,
and disable browser headers and footers. The server `/generate-pdf?url=...`
uses the same print styles and CSS page margins as the export script.

Validation performed: TypeScript build, server lint, visual inspection of every
PDF page, A4 page counts, full content extraction, PDF link annotations,
matching server/export PDF text, and desktop/mobile layout checks.
