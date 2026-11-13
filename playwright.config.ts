import { defineConfig, devices } from '@playwright/test';

// Par défaut, les tests e2e tournent sur la version de production locale (vite preview),
// servie dans un sous-répertoire pour imiter GitHub Pages.
// Pour tester le site publié : E2E_BASE_URL=https://bftr.github.io/mission-francophonie/ npx playwright test
const remote = process.env.E2E_BASE_URL;
export const BASE_URL = remote ?? 'http://localhost:4173/mission-francophonie/';

export default defineConfig({
  testDir: 'tests/e2e',
  timeout: 30_000,
  use: { baseURL: BASE_URL, trace: 'retain-on-failure' },
  projects: [{ name: 'chromebook', use: { ...devices['Desktop Chrome'], viewport: { width: 1366, height: 768 } } }],
  webServer: remote
    ? undefined
    : {
        command: 'npx vite preview --port 4173 --strictPort --base /mission-francophonie/',
        url: 'http://localhost:4173/mission-francophonie/',
        reuseExistingServer: true,
      },
});
