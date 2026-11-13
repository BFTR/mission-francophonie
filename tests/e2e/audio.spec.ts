import { expect, test, type Page } from '@playwright/test';

/**
 * Correspondance message ↔ audio, SANS actualiser la page.
 * On espionne HTMLMediaElement.play() pour savoir quel fichier est réellement lu.
 * (Retour de classe : « le texte change, mais l'audio lit le message précédent ».)
 */

const SAVE = 'mission-francophonie:signal-perdu:v1';

async function spyAudio(page: Page) {
  await page.addInitScript(() => {
    const w = window as unknown as { __played: string[]; __audios: HTMLMediaElement[] };
    w.__played = [];
    w.__audios = [];
    const orig = HTMLMediaElement.prototype.play;
    HTMLMediaElement.prototype.play = function (this: HTMLMediaElement) {
      w.__played.push(this.currentSrc || this.src);
      if (!w.__audios.includes(this)) w.__audios.push(this);
      return orig.call(this);
    };
  });
}

const played = (page: Page) =>
  page.evaluate(() => (window as unknown as { __played: string[] }).__played.map((s) => s.split('/').pop()));

async function startAt(page: Page, save: object) {
  await page.addInitScript(
    ([key, value]) => {
      if (!sessionStorage.getItem('seeded')) {
        localStorage.setItem(key, value);
        sessionStorage.setItem('seeded', '1');
      }
    },
    [SAVE, JSON.stringify(save)] as const,
  );
  await page.goto('./');
}

const base = {
  version: 1,
  group: '7-17',
  screen: 'mission',
  status: { lafayette: 'done', portauprince: 'done', fortdefrance: 'open', cayenne: 'locked', saintpierre: 'locked' },
};

test('mission 3 : chaque réplique lit SON audio, sans actualiser', async ({ page }) => {
  await spyAudio(page);
  await startAt(page, { ...base, station: 'fortdefrance', m3: { phase: 'chat', node: 0 } });
  const listen = () => page.locator('.bubble--current').getByRole('button', { name: /Écouter|Réécouter/ });

  await listen().click();
  await page.locator('.reply', { hasText: 'Bonjour, madame.' }).click();
  await listen().click();
  await page.locator('.reply', { hasText: 'Je viens d’Ottawa, au Canada.' }).click();
  await listen().click();
  await page.locator('.reply', { hasText: 'Pouvez-vous m’aider?' }).click();
  await listen().click();
  await page.locator('.reply', { hasText: 'Salut, Théo!' }).click();
  await listen().click();
  await page.locator('.reply', { hasText: 'Oui, j’adore la musique!' }).click();
  await listen().click();

  expect(await played(page)).toEqual(['m3-j1.mp3', 'm3-j2.mp3', 'm3-j3.mp3', 'm3-t1.mp3', 'm3-t2.mp3', 'm3-t3.mp3']);
});

test('mission 3 : changer de réplique arrête l’audio en cours', async ({ page }) => {
  await spyAudio(page);
  await startAt(page, { ...base, station: 'fortdefrance', m3: { phase: 'chat', node: 0 } });
  await page
    .locator('.bubble--current')
    .getByRole('button', { name: /Écouter/ })
    .click();
  await page.locator('.reply', { hasText: 'Bonjour, madame.' }).click();
  // Plus aucun lecteur ne joue après le changement de réplique
  const stillPlaying = await page.evaluate(
    () => (window as unknown as { __audios: HTMLMediaElement[] }).__audios.filter((a) => !a.paused).length,
  );
  expect(stillPlaying, 'l’audio de la réplique précédente doit s’arrêter').toBe(0);
  await expect(page.locator('.bubble--current').getByRole('button', { name: /^Écouter/ })).toBeVisible();
});

test('mission 2 : chaque canal lit son propre message, même en alternant vite', async ({ page }) => {
  await spyAudio(page);
  await startAt(page, {
    ...base,
    station: 'portauprince',
    status: { ...base.status, portauprince: 'open', fortdefrance: 'locked' },
    m2: { phase: 'console', answers: {} },
  });
  const ch = (i: number) =>
    page
      .locator('.channel')
      .nth(i)
      .getByRole('button', { name: /Écouter|Réécouter|Arrêter/ });
  await ch(0).click();
  await ch(2).click();
  await ch(1).click();
  await ch(0).click();
  expect(await played(page)).toEqual(['m2-meteo.mp3', 'm2-heure.mp3', 'm2-jour.mp3', 'm2-meteo.mp3']);
});

test('aller-retour carte ↔ mission : le bon audio sans actualiser', async ({ page }) => {
  await spyAudio(page);
  await startAt(page, { ...base, station: 'fortdefrance', m3: { phase: 'chat', node: 0 } });
  await page
    .locator('.bubble--current')
    .getByRole('button', { name: /Écouter/ })
    .click();
  await page.locator('.reply', { hasText: 'Bonjour, madame.' }).click();
  await page.getByRole('button', { name: /Retour à la carte/ }).click();
  await page.getByRole('button', { name: /^Jouer/ }).click();
  await page
    .locator('.bubble--current')
    .getByRole('button', { name: /Écouter/ })
    .click();
  expect(await played(page)).toEqual(['m3-j1.mp3', 'm3-j2.mp3']);
});

test('arrêts et changements rapides : jamais de voix de secours parasite', async ({ page }) => {
  await spyAudio(page);
  // Le Chromebook a une voix française : on compte ce que la synthèse prononcerait.
  await page.addInitScript(() => {
    const spoken: string[] = [];
    (window as unknown as { __spoken: string[] }).__spoken = spoken;
    // On enregistre chaque texte que le jeu tente de confier à la voix de secours.
    const Orig = window.SpeechSynthesisUtterance;
    window.SpeechSynthesisUtterance = function (text?: string) {
      spoken.push(String(text));
      return new Orig(text);
    } as unknown as typeof SpeechSynthesisUtterance;
  });
  // Réseau d'école lent : chaque fichier audio met 1 s à arriver.
  await page.route('**/audio/*.mp3', async (r) => {
    await new Promise((res) => setTimeout(res, 1000));
    await r.continue();
  });
  await startAt(page, {
    ...base,
    station: 'portauprince',
    status: { ...base.status, portauprince: 'open', fortdefrance: 'locked' },
    m2: { phase: 'console', answers: {} },
  });
  const ch = (i: number) =>
    page
      .locator('.channel')
      .nth(i)
      .getByRole('button', { name: /Écouter|Réécouter|Arrêter/ });
  // Clics rapides : on démarre un canal puis on en démarre un autre aussitôt
  await ch(0).click({ delay: 0 });
  await ch(2).click({ delay: 0 });
  await ch(1).click({ delay: 0 });
  await page.waitForTimeout(2500);
  const spoken = await page.evaluate(() => (window as unknown as { __spoken: string[] }).__spoken);
  expect(spoken, 'la voix de secours ne doit pas lire un ancien message').toEqual([]);
  await expect(page.locator('.clip__warn')).toHaveCount(0);
});
