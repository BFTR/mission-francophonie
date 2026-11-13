import { expect, test, type Page } from '@playwright/test';
import { BASE_URL } from '../../playwright.config';

/** Seul hôte autorisé : celui du site testé (local ou GitHub Pages). */
const SITE_HOSTS = ['localhost', '127.0.0.1', new URL(BASE_URL).hostname];

/** Clique un produit de l'étal par son nom accessible. */
const produce = (page: Page, fr: string) => page.getByRole('button', { name: `Produit : ${fr}` });
const LIST = [
  'des oignons',
  'du céleri',
  'un poivron vert',
  'des crevettes',
  'du riz',
  'de l’ail',
  'de la saucisse',
  'du gombo',
];

async function startToMap(page: Page) {
  await page.goto('./');
  await page.getByRole('radio', { name: /7-17/ }).click();
  await page.getByRole('button', { name: /Commencer la mission/ }).click();
  for (let i = 0; i < 4; i++) await page.getByRole('button', { name: /Suivant/ }).click();
  await page.getByRole('button', { name: /Voir la carte/ }).click();
  await expect(page.getByRole('heading', { name: /Carte du Réseau Écho/ })).toBeVisible();
}

test.describe('Parcours complet de la mission 1', () => {
  test('premier lancement → mission 1 → récompense → carte → recommencer', async ({ page }) => {
    const external: string[] = [];
    const failed: string[] = [];
    page.on('request', (r) => {
      const u = new URL(r.url());
      if (!SITE_HOSTS.includes(u.hostname) && u.protocol !== 'data:') external.push(r.url());
    });
    page.on('response', (r) => {
      if (r.status() >= 400) failed.push(`${r.status()} ${r.url()}`);
    });
    const errors: string[] = [];
    page.on('pageerror', (e) => errors.push(e.message));

    // Accueil : impossible de partir sans groupe
    await page.goto('./');
    await expect(page.getByRole('heading', { name: 'Mission Francophonie' })).toBeVisible();
    await page.getByRole('button', { name: /Commencer la mission/ }).click();
    await expect(page.getByRole('alert')).toContainText('Choisis ton groupe');

    await page.getByRole('radio', { name: /7-17/ }).click();
    await page.getByRole('button', { name: /Commencer la mission/ }).click();
    for (let i = 0; i < 4; i++) await page.getByRole('button', { name: /Suivant/ }).click();
    await page.getByRole('button', { name: /Voir la carte/ }).click();

    // Station verrouillée
    await page.getByRole('button', { name: /Station 3, Fort-de-France : éteinte/ }).click();
    await expect(page.getByText('Station éteinte. Rallume d’abord la station précédente.')).toBeVisible();

    // Entrer dans la mission 1
    await page.getByRole('button', { name: /Station 1, Lafayette/ }).click();
    await page.getByRole('button', { name: /^Jouer/ }).click();
    await page.getByRole('button', { name: /Aller au marché/ }).click();

    // Mauvaise réponse
    await produce(page, 'un poivron rouge').click();
    await expect(page.getByText('C’est un poivron rouge. Claire veut un poivron vert.')).toBeVisible();

    // Indices progressifs
    const hint = page.getByRole('button', { name: /^Indice/ });
    await hint.click();
    await expect(page.getByText(/Indice 1 \/ 3/)).toBeVisible();
    await hint.click();
    await expect(page.locator('.stall__shelf--hint')).toHaveCount(1);
    await hint.click();
    await expect(page.locator('.produce--flash')).toHaveCount(1);

    // Trouver 7 ingrédients, actualiser, vérifier la reprise
    for (const fr of LIST.slice(0, 7)) await produce(page, fr).click();
    await expect(page.locator('.m1-list__count')).toHaveText('7 / 8');
    await page.reload();
    await expect(page.locator('.m1-list__count')).toHaveText('7 / 8');

    // Double clic sur un produit déjà trouvé
    await produce(page, 'du riz').dblclick();
    await expect(page.getByText('Déjà trouvé', { exact: false })).toBeVisible();

    await produce(page, 'du gombo').click();
    await expect(page.getByText('Tu as trouvé les huit ingrédients', { exact: false })).toBeVisible();
    await page.getByRole('button', { name: /^Continuer/ }).click();

    // Quantités : piège du P.-S., avec clics rapides
    const plus = (label: string) => page.getByRole('button', { name: `Plus de ${label}`, exact: true });
    for (const [label, n] of [
      ['oignons', 4],
      ['poivrons verts', 2],
      ['kilos de crevettes', 3],
      ['sac(s) de riz', 1],
      ['saucisses', 6],
    ] as const) {
      for (let i = 0; i < n; i++) await plus(label).click({ delay: 0 });
    }
    await page.getByRole('button', { name: /^Vérifier/ }).click();
    await expect(page.getByText('Relis le P.-S.!', { exact: true })).toBeVisible();
    const moins = page.getByRole('button', { name: 'Moins de oignons', exact: true });
    await moins.click();
    await moins.click();
    await page.getByRole('button', { name: /^Vérifier/ }).click();

    // Récompense
    await expect(page.getByRole('heading', { name: /Station 1 rallumée/ })).toBeVisible();
    await expect(page.locator('.keycard__word')).toHaveText('un gombo');
    await expect(page.getByRole('img', { name: 'Mots-clés : 1 sur 5' })).toBeVisible();

    // Retour à la carte : station 1 cochée, station 2 ouverte et jouable
    await page
      .getByRole('button', { name: /Retour à la carte/ })
      .first()
      .click();
    await expect(page.getByRole('button', { name: /Station 1, Lafayette : rallumée/ })).toBeVisible();
    await expect(page.getByRole('button', { name: /Station 2, Port-au-Prince : à rallumer/ })).toBeVisible();
    await expect(page.getByRole('button', { name: /^Jouer/ })).toBeVisible();

    // Recommencer avec confirmation (annuler puis confirmer)
    await page.getByRole('button', { name: 'Menu' }).click();
    await page
      .getByRole('dialog')
      .getByRole('button', { name: /Recommencer/ })
      .click();
    await page.getByRole('button', { name: /Annuler/ }).click();
    await expect(page.getByRole('heading', { name: /Carte du Réseau Écho/ })).toBeVisible();
    await page.getByRole('button', { name: 'Menu' }).click();
    await page
      .getByRole('dialog')
      .getByRole('button', { name: /Recommencer/ })
      .click();
    await page.getByRole('button', { name: /Oui, effacer/ }).click();
    await expect(page.getByRole('button', { name: /Commencer la mission/ })).toBeVisible();
    await expect(page.getByRole('radio', { name: /7-17/ })).toHaveAttribute('aria-checked', 'false');

    expect(external, 'aucune requête vers un service tiers').toEqual([]);
    expect(failed, 'aucune ressource manquante').toEqual([]);
    expect(errors, 'aucune erreur JavaScript').toEqual([]);
  });

  test('stockage local bloqué : avertissement affiché, jeu jouable', async ({ page }) => {
    await page.addInitScript(() => {
      Object.defineProperty(window, 'localStorage', {
        get() {
          throw new Error('bloqué par la politique');
        },
      });
    });
    await page.goto('./');
    await expect(page.getByText('ce navigateur ne peut pas sauvegarder', { exact: false })).toBeVisible();
    await page.getByRole('radio', { name: /7-15/ }).click();
    await page.getByRole('button', { name: /Commencer la mission/ }).click();
    await expect(page.getByText('Je m’appelle Lumi', { exact: false })).toBeVisible();
  });

  test('sauvegarde corrompue : message clair et départ propre', async ({ page }) => {
    await page.addInitScript(() => {
      if (!sessionStorage.getItem('seeded')) {
        localStorage.setItem('mission-francophonie:signal-perdu:v1', '{cassé');
        sessionStorage.setItem('seeded', '1');
      }
    });
    await page.goto('./');
    await expect(page.getByText('La sauvegarde était illisible', { exact: false })).toBeVisible();
    await expect(page.getByRole('button', { name: /Commencer la mission/ })).toBeVisible();
  });

  test('navigation au clavier : choisir un groupe et démarrer', async ({ page }) => {
    await page.goto('./');
    await page.getByRole('radio', { name: /7-18/ }).focus();
    await page.keyboard.press('Enter');
    await expect(page.getByRole('radio', { name: /7-18/ })).toHaveAttribute('aria-checked', 'true');
    await page.getByRole('button', { name: /Commencer la mission/ }).focus();
    await page.keyboard.press('Enter');
    await expect(page.getByText('Je m’appelle Lumi', { exact: false })).toBeVisible();
    // Le focus est visible (anneau dessiné par :focus-visible)
    await page.keyboard.press('Tab');
    const ring = await page.evaluate(() => getComputedStyle(document.activeElement as Element).boxShadow);
    expect(ring).not.toBe('none');
  });

  test('aller-retour carte ↔ mission sans perte et accès direct impossible', async ({ page }) => {
    await startToMap(page);
    // Une station verrouillée n'offre aucun bouton « Jouer »
    await page.getByRole('button', { name: /Station 5, Saint-Pierre/ }).click();
    await expect(page.getByRole('button', { name: /^Jouer/ })).toHaveCount(0);
    await page.getByRole('button', { name: /Station 1, Lafayette/ }).click();
    await page.getByRole('button', { name: /^Jouer/ }).click();
    await page.getByRole('button', { name: /Aller au marché/ }).click();
    await produce(page, 'du riz').click();
    await page.getByRole('button', { name: /Retour à la carte/ }).click();
    await page.getByRole('button', { name: /^Jouer/ }).click();
    await expect(page.locator('.m1-list__count')).toHaveText('1 / 8');
  });
});
