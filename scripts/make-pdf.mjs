// Exporte les fiches imprimables en PDF (format Lettre), polices du jeu intégrées.
// Usage : npm run pdf   → docs/pdf/fiche-eleve.pdf, docs/pdf/fiche-enseignant.pdf
// Prérequis : navigateur Playwright installé (npx playwright install chromium).
import { mkdirSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { pathToFileURL } from 'node:url';
import { chromium } from '@playwright/test';

const font = (p) => pathToFileURL(resolve('node_modules', p)).href;
const FONTS = `
  @font-face { font-family: "Atkinson Hyperlegible"; font-weight: 400; src: url("${font('@fontsource/atkinson-hyperlegible/files/atkinson-hyperlegible-latin-400-normal.woff2')}") format("woff2"); }
  @font-face { font-family: "Atkinson Hyperlegible"; font-weight: 700; src: url("${font('@fontsource/atkinson-hyperlegible/files/atkinson-hyperlegible-latin-700-normal.woff2')}") format("woff2"); }
  @font-face { font-family: "Bricolage Grotesque"; font-weight: 200 800; src: url("${font('@fontsource-variable/bricolage-grotesque/files/bricolage-grotesque-latin-wght-normal.woff2')}") format("woff2"); }
  h1, h2, .sub, .tag, .url, .addr { font-family: "Bricolage Grotesque", "Atkinson Hyperlegible", sans-serif; }
`;

const DOCS = [
  { html: 'docs/fiche-eleve.html', pdf: 'docs/pdf/fiche-eleve.pdf', expectPages: 1 },
  { html: 'docs/fiche-enseignant.html', pdf: 'docs/pdf/fiche-enseignant.pdf' },
];

mkdirSync('docs/pdf', { recursive: true });
const browser = await chromium.launch();
let ok = true;
for (const d of DOCS) {
  const page = await browser.newPage();
  await page.goto(pathToFileURL(resolve(d.html)).href);
  await page.addStyleTag({ content: FONTS });
  await page.emulateMedia({ media: 'print' });
  await page.evaluate(() => document.fonts.ready);
  const fontsOk = await page.evaluate(
    () =>
      document.fonts.check('700 16px "Atkinson Hyperlegible"') &&
      document.fonts.check('700 16px "Bricolage Grotesque"'),
  );
  const overflow = await page.evaluate(() =>
    [...document.querySelectorAll('.fiche')].some((f) => f.scrollHeight > f.clientHeight + 1),
  );
  const buf = await page.pdf({ format: 'Letter', preferCSSPageSize: true, printBackground: true });
  writeFileSync(d.pdf, buf);
  const pages = (buf.toString('latin1').match(/\/Type\s*\/Page[^s]/g) || []).length;
  const bad = (d.expectPages && pages !== d.expectPages) || overflow || !fontsOk;
  if (bad) ok = false;
  console.log(
    `${bad ? '✗' : '✓'} ${d.pdf} · ${pages} page(s) · ${(buf.length / 1024).toFixed(0)} Ko · polices ${fontsOk ? 'intégrées' : 'MANQUANTES'}${overflow ? ' · CONTENU COUPÉ' : ''}`,
  );
  await page.close();
}
await browser.close();
if (!ok) process.exit(1);
