import AxeBuilder from '@axe-core/playwright';
import { expect, test, type Page } from '@playwright/test';

/**
 * Partie complète, comme un élève : 5 missions, erreurs volontaires, écran final.
 * Un audit d'accessibilité automatique (axe-core, WCAG 2.x A/AA) est fait sur chaque écran clé.
 */

const issues: string[] = [];

async function axe(page: Page, label: string) {
  const r = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa']).analyze();
  for (const v of r.violations) {
    issues.push(`${label} · ${v.id} (${v.impact}) · ${v.nodes.length} élément(s) · ${v.nodes[0]?.target.join(' ')}`);
  }
}

const btn = (page: Page, re: RegExp) => page.getByRole('button', { name: re });

test('partie complète : accueil → 5 stations → MISSION ACCOMPLIE', async ({ page }) => {
  test.setTimeout(120_000);
  const external: string[] = [];
  const failed: string[] = [];
  const errors: string[] = [];
  page.on('request', (r) => {
    const u = new URL(r.url());
    if (!['localhost', '127.0.0.1'].includes(u.hostname) && u.protocol !== 'data:') external.push(r.url());
  });
  page.on('response', (r) => {
    if (r.status() >= 400) failed.push(`${r.status()} ${r.url()}`);
  });
  page.on('pageerror', (e) => errors.push(e.message));
  // Mesure des contrastes sur l'état final des écrans (pas pendant les fondus d'entrée).
  await page.emulateMedia({ reducedMotion: 'reduce' });

  await page.goto('./');
  await axe(page, 'accueil');
  await page.getByRole('radio', { name: /7-15/ }).click();
  await btn(page, /Commencer la mission/).click();
  await axe(page, 'briefing');
  for (let i = 0; i < 4; i++) await btn(page, /Suivant/).click();
  await btn(page, /Voir la carte/).click();
  await axe(page, 'carte');

  /* ---------- Station 1 ---------- */
  await btn(page, /^Jouer/).click();
  await btn(page, /Aller au marché/).click();
  await axe(page, 'mission 1 fouille');
  for (const fr of [
    'des oignons',
    'du céleri',
    'un poivron vert',
    'des crevettes',
    'du riz',
    'de l’ail',
    'de la saucisse',
    'du gombo',
  ]) {
    await page.getByRole('button', { name: `Produit : ${fr}` }).click();
  }
  await btn(page, /^Continuer/).click();
  for (const [label, n] of [
    ['oignons', 2],
    ['poivrons verts', 2],
    ['kilos de crevettes', 3],
    ['sac(s) de riz', 1],
    ['saucisses', 6],
  ] as const) {
    for (let i = 0; i < n; i++) await page.getByRole('button', { name: `Plus de ${label}`, exact: true }).click();
  }
  await axe(page, 'mission 1 quantités');
  await btn(page, /^Vérifier/).click();
  await expect(page.getByRole('heading', { name: /Station 1 rallumée/ })).toBeVisible();
  // Dossier secret : une bonne réponse
  await btn(page, /Dossier secret/).click();
  await page.getByRole('button', { name: 'le fromage', exact: true }).click();
  await expect(page.getByText('1 / 3 réussis')).toBeVisible();
  await axe(page, 'récompense + dossier secret');
  await btn(page, /Retour à la carte/)
    .first()
    .click();

  /* ---------- Station 2 ---------- */
  await btn(page, /^Jouer/).click();
  await axe(page, 'mission 2 intro');
  await btn(page, /Entrer dans le studio/).click();
  // L'audio se charge depuis le sous-dossier
  const audioResp = page.waitForResponse((r) => r.url().includes('/audio/m2-meteo.mp3'));
  await page
    .locator('.channel')
    .first()
    .getByRole('button', { name: /Écouter/ })
    .click();
  expect((await audioResp).status()).toBeLessThan(400);
  // Transcription (adaptation) sur le canal 1
  await page.locator('.channel').first().getByRole('button', { name: /Texte/ }).click();
  await expect(page.getByText('Ce matin, il pleut.', { exact: false })).toBeVisible();
  await axe(page, 'mission 2 console');
  // Erreur volontaire (distracteur), puis bonnes réponses
  await page.getByRole('radio', { name: 'vendredi' }).click();
  await page.getByRole('radio', { name: 'Il fait soleil.' }).click();
  await page.getByRole('radio', { name: '14 h' }).click();
  await btn(page, /^Transmettre/).click();
  await expect(page.getByText('le festival n’est PAS vendredi', { exact: false })).toBeVisible();
  await page.getByRole('radio', { name: 'samedi' }).click();
  await btn(page, /^Transmettre/).click();
  await expect(page.getByRole('heading', { name: /Station 2 rallumée/ })).toBeVisible();
  await btn(page, /Retour à la carte/)
    .first()
    .click();

  /* ---------- Station 3 ---------- */
  await btn(page, /^Jouer/).click();
  await btn(page, /Entrer dans le café/).click();
  await axe(page, 'mission 3 conversation');
  await page.locator('.reply', { hasText: 'Salut! Tu as un jus' }).click();
  await expect(page.getByText('Mauvais ton!', { exact: false })).toBeVisible();
  await page.locator('.reply', { hasText: 'Bonjour, madame.' }).click();
  await page.locator('.reply', { hasText: 'Je viens d’Ottawa, au Canada.' }).click();
  await page.locator('.reply', { hasText: 'Pouvez-vous m’aider?' }).click();
  await page.locator('.reply', { hasText: 'Salut, Théo!' }).click();
  await page.locator('.reply', { hasText: 'Oui, j’adore la musique!' }).click();
  await page.locator('.reply', { hasText: 'Venez!' }).click();
  await expect(page.getByRole('heading', { name: /Station 3 rallumée/ })).toBeVisible();
  await btn(page, /Retour à la carte/)
    .first()
    .click();

  /* ---------- Station 4 ---------- */
  await btn(page, /^Jouer/).click();
  await btn(page, /Ouvrir le plan/).click();
  await axe(page, 'mission 4 plan');
  const goTo = (name: string) => page.getByRole('button', { name: new RegExp(`^Aller à ${name}`) });
  await goTo('le musée').click();
  await expect(page.getByText('Inès n’est pas ici.', { exact: false })).toBeVisible();
  await goTo('la bibliothèque').click();
  await btn(page, /Lire le message suivant/).click();
  await goTo('le marché').click();
  await btn(page, /Lire le message suivant/).click();
  await goTo('la place des Palmistes').click();
  await btn(page, /Lire le message suivant/).click();
  await goTo('le café \\(près du musée\\)').click();
  await btn(page, /Parler à Inès/).click();
  await expect(page.getByRole('heading', { name: /Station 4 rallumée/ })).toBeVisible();
  await btn(page, /Retour à la carte/)
    .first()
    .click();

  /* ---------- Station 5 ---------- */
  await btn(page, /^Jouer/).click();
  await btn(page, /Monter au phare/).click();
  await axe(page, 'mission 5 phrases');
  const tile = (t: string) => page.locator('.builder__bank .tile', { hasText: new RegExp(`^${t}$`) }).click();
  for (const t of ['Viens', 'au', 'festival', 'francophone']) await tile(t);
  await btn(page, /^Vérifier/).click();
  await expect(page.getByText('« Viens », c’est pour un seul ami.', { exact: false })).toBeVisible();
  await btn(page, /^Effacer/).click();
  for (const t of ['Venez', 'au', 'festival', 'francophone']) await tile(t);
  await btn(page, /^Vérifier/).click();
  await btn(page, /Phrase suivante/).click();
  for (const t of ['Le', 'festival', 'est', 'samedi', 'à 14 h', 'au port']) await tile(t);
  await btn(page, /^Vérifier/).click();
  await btn(page, /Phrase suivante/).click();
  for (const t of ['Il', 'y', 'a', 'un', 'gombo', 'au', 'menu']) await tile(t);
  await btn(page, /^Vérifier/).click();
  await btn(page, /Dernière étape/).click();
  await axe(page, 'mission 5 touche personnelle');
  await page.getByLabel('J’apporte').fill('de la pain');
  await btn(page, /^Vérifier/).click();
  await expect(page.getByText('« pain » est masculin', { exact: false })).toBeVisible();
  await page.getByLabel('J’apporte').fill('du pain');
  await btn(page, /^Vérifier/).click();
  await btn(page, /Allumer le phare/).click();
  await expect(page.getByRole('heading', { name: /Station 5 rallumée/ })).toBeVisible({ timeout: 5000 });
  await btn(page, /Voir l’écran final/).click();

  /* ---------- Écran final ---------- */
  await expect(page.getByRole('heading', { name: 'MISSION ACCOMPLIE!' })).toBeVisible();
  await expect(page.locator('.finale__code')).toHaveText(/^ECHO-715-[A-Z0-9]{4}$/);
  await expect(page.getByText('J’apporte du pain.')).toBeVisible();
  await expect(page.getByText('écoute réussie avec la transcription', { exact: false })).toBeVisible();
  await expect(page.getByText(/Dossiers secrets réussis : 1 \/ 15/)).toBeVisible();
  await axe(page, 'écran final');
  const code = await page.locator('.finale__code').innerText();

  // Reprise après actualisation sur l'écran final
  await page.reload();
  await expect(page.getByRole('heading', { name: 'MISSION ACCOMPLIE!' })).toBeVisible();

  // Espace enseignant : même code pour le groupe 7-15
  await page.goto('./#enseignant');
  await expect(page.getByRole('heading', { name: 'Espace enseignant' })).toBeVisible();
  await expect(page.getByRole('row', { name: /7-15/ })).toContainText(code);
  await axe(page, 'espace enseignant');

  expect(external, 'aucune requête vers un service tiers').toEqual([]);
  expect(failed, 'aucune ressource manquante').toEqual([]);
  expect(errors, 'aucune erreur JavaScript').toEqual([]);
  // Le rapport d'accessibilité est imprimé pour l'audit ; on échoue sur toute violation.
  console.log(`AXE: ${issues.length} violation(s)\n${issues.join('\n')}`);
  expect(issues, 'violations d’accessibilité axe-core').toEqual([]);
});

test('son indisponible : la transcription permet de terminer la mission 2', async ({ page }) => {
  await page.route('**/audio/*.mp3', (r) => r.abort());
  await page.addInitScript(() => {
    // Aucune voix de synthèse non plus
    Object.defineProperty(window, 'speechSynthesis', { value: { getVoices: () => [], speak() {}, cancel() {} } });
    localStorage.setItem(
      'mission-francophonie:signal-perdu:v1',
      JSON.stringify({
        version: 1,
        group: '7-18',
        screen: 'mission',
        station: 'portauprince',
        status: {
          lafayette: 'done',
          portauprince: 'open',
          fortdefrance: 'locked',
          cayenne: 'locked',
          saintpierre: 'locked',
        },
        m2: { phase: 'console', answers: {} },
      }),
    );
  });
  await page.goto('./');
  await page
    .locator('.channel')
    .first()
    .getByRole('button', { name: /Écouter/ })
    .click();
  await expect(page.getByText('Le son ne fonctionne pas sur cet appareil', { exact: false })).toBeVisible();
  for (const ch of await page.locator('.channel').all()) await ch.getByRole('button', { name: /Texte/ }).click();
  await expect(page.getByText('Le festival, c’est samedi!', { exact: false })).toBeVisible();
  await page.getByRole('radio', { name: 'Il fait soleil.' }).click();
  await page.getByRole('radio', { name: 'samedi' }).click();
  await page.getByRole('radio', { name: '14 h' }).click();
  await btn(page, /^Transmettre/).click();
  await expect(page.getByRole('heading', { name: /Station 2 rallumée/ })).toBeVisible();
});

test('accès direct à l’écran final sans avoir joué : refusé', async ({ page }) => {
  await page.addInitScript(() => {
    localStorage.setItem(
      'mission-francophonie:signal-perdu:v1',
      JSON.stringify({ version: 1, group: '7-17', screen: 'finale' }),
    );
  });
  await page.goto('./');
  await expect(page.getByRole('heading', { name: /Carte du Réseau Écho/ })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'MISSION ACCOMPLIE!' })).toHaveCount(0);
});

test('réduction des animations respectée', async ({ browser }) => {
  const ctx = await browser.newContext({
    reducedMotion: 'reduce',
    viewport: { width: 1366, height: 768 },
    baseURL: 'http://localhost:4173/mission-francophonie/',
  });
  const page = await ctx.newPage();
  await page.goto('./');
  const dur = await page.evaluate(() => getComputedStyle(document.querySelector('.enter')!).animationDuration);
  expect(parseFloat(dur)).toBeLessThan(0.05);
  await ctx.close();
});
