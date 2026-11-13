import { readFileSync } from 'node:fs';
import { expect, test, type Page } from '@playwright/test';

/**
 * Le jeu fonctionne-t-il avec les en-têtes de sécurité de vercel.json (CSP stricte, etc.)?
 * On applique ces en-têtes à chaque réponse du serveur de test, puis on guette toute violation.
 */
type VercelHeader = { source: string; headers: { key: string; value: string }[] };
const vercel = JSON.parse(readFileSync('vercel.json', 'utf8')) as { headers: VercelHeader[] };
const globalHeaders = Object.fromEntries(
  vercel.headers.find((h) => h.source === '/(.*)')!.headers.map((h) => [h.key, h.value]),
);

async function withVercelHeaders(page: Page) {
  await page.route('**/*', async (route) => {
    const res = await route.fetch();
    await route.fulfill({ response: res, headers: { ...res.headers(), ...globalHeaders } });
  });
  await page.addInitScript(() => {
    const v: string[] = [];
    (window as unknown as { __csp: string[] }).__csp = v;
    document.addEventListener('securitypolicyviolation', (e) => v.push(`${e.violatedDirective} ${e.blockedURI}`));
  });
}

const violations = (page: Page) => page.evaluate(() => (window as unknown as { __csp: string[] }).__csp);

test('en-têtes Vercel : aucune violation de la politique de sécurité', async ({ page }) => {
  const errors: string[] = [];
  page.on('pageerror', (e) => errors.push(e.message));
  await withVercelHeaders(page);
  await page.goto('./');
  // L'en-tête est bien appliqué
  const csp = await page.evaluate(async () => (await fetch(location.href)).headers.get('content-security-policy'));
  expect(csp).toContain("default-src 'self'");

  await page.getByRole('radio', { name: /7-15/ }).click();
  await page.getByRole('button', { name: /Commencer la mission/ }).click();
  for (let i = 0; i < 4; i++) await page.getByRole('button', { name: /Suivant/ }).click();
  await page.getByRole('button', { name: /Voir la carte/ }).click();
  await page.getByRole('button', { name: /^Jouer/ }).click();
  await page.getByRole('button', { name: /Aller au marché/ }).click();
  await page.getByRole('button', { name: 'Produit : des oignons' }).click();
  // Polices auto-hébergées chargées malgré la CSP
  expect(await page.evaluate(() => document.fonts.check('700 16px "Atkinson Hyperlegible"'))).toBe(true);

  // Audio sous CSP (mission 2)
  await page.evaluate(() => {
    const k = 'mission-francophonie:signal-perdu:v1';
    const s = JSON.parse(localStorage.getItem(k)!);
    s.status.lafayette = 'done';
    s.status.portauprince = 'open';
    s.screen = 'mission';
    s.station = 'portauprince';
    s.m2 = { phase: 'console', answers: {} };
    localStorage.setItem(k, JSON.stringify(s));
  });
  await page.reload();
  const audio = page.waitForResponse((r) => r.url().includes('/audio/m2-meteo.mp3'));
  await page
    .locator('.channel')
    .first()
    .getByRole('button', { name: /Écouter/ })
    .click();
  expect((await audio).status()).toBeLessThan(400);
  await page.waitForTimeout(500);
  await expect(page.locator('.clip__warn')).toHaveCount(0);

  // Espace enseignant et écran avec SVG/dialogues
  await page.goto('./#enseignant');
  await expect(page.getByRole('heading', { name: 'Espace enseignant' })).toBeVisible();

  expect(await violations(page)).toEqual([]);
  expect(errors).toEqual([]);
});

test('mode projecteur : par l’adresse #classe et par le menu, sans débordement', async ({ page }) => {
  await page.goto('./#classe');
  await expect(page.locator('html')).toHaveAttribute('data-projector', '');
  expect(await page.evaluate(() => getComputedStyle(document.documentElement).fontSize)).toBe('20px');
  // Désactiver depuis l'accueil
  await page.getByRole('button', { name: /Mode projecteur/ }).click();
  await expect(page.locator('html')).not.toHaveAttribute('data-projector', '');
  // Réactiver, jouer jusqu'à une mission : aucun défilement horizontal
  await page.getByRole('button', { name: /Mode projecteur/ }).click();
  await page.getByRole('radio', { name: /7-18/ }).click();
  await page.getByRole('button', { name: /Commencer la mission/ }).click();
  for (let i = 0; i < 4; i++) await page.getByRole('button', { name: /Suivant/ }).click();
  await page.getByRole('button', { name: /Voir la carte/ }).click();
  await page.getByRole('button', { name: /^Jouer/ }).click();
  await page.getByRole('button', { name: /Aller au marché/ }).click();
  const overflow = await page.evaluate(
    () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
  );
  expect(overflow).toBeLessThanOrEqual(0);
  // Le réglage est conservé après actualisation
  await page.reload();
  await expect(page.locator('html')).toHaveAttribute('data-projector', '');
});
