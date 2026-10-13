const fs = require('node:fs/promises');
const path = require('node:path');
const { pathToFileURL } = require('node:url');
const puppeteer = require('puppeteer');

async function main() {
  const root = path.resolve(__dirname, '..');
  const browser = await puppeteer.launch({ headless: true });
  try {
    for (const [source, filename] of [
      ['index.html', 'CV_LCherchenko_QA_Designed.pdf'],
      ['ats.html', 'CV_LCherchenko_QA_ATS.pdf'],
    ]) {
      const page = await browser.newPage();
      await page.setViewport({ width: 1200, height: 1600 });
      await page.goto(pathToFileURL(path.join(root, 'public', source)).href, {
        waitUntil: 'load',
      });
      await page.emulateMediaType('print');
      await page.evaluate(async () => {
        await document.fonts.ready;
        await Promise.all(Array.from(document.images, (image) => image.decode()));
      });
      const output = path.join(root, filename);
      await page.pdf({
        path: output,
        format: 'A4',
        preferCSSPageSize: true,
        printBackground: true,
        tagged: true,
      });
      console.log(`${filename}: ${(await fs.stat(output)).size} bytes`);
      await page.close();
    }
  } finally {
    await browser.close();
  }
}
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
