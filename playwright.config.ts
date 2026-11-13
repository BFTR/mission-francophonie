import { defineConfig, devices } from '@playwright/test';

// Les tests e2e tournent sur la version de production (vite preview),
// servie dans un sous-répertoire pour imiter GitHub Pages.
export default defineConfig({
  testDir: 'tests/e2e',
  timeout: 30_000,
  use: { baseURL: 'http://localhost:4173/mission-francophonie/', trace: 'retain-on-failure' },
  projects: [{ name: 'chromebook', use: { ...devices['Desktop Chrome'], viewport: { width: 1366, height: 768 } } }],
  webServer: {
    command: 'npx vite preview --port 4173 --strictPort --base /mission-francophonie/',
    url: 'http://localhost:4173/mission-francophonie/',
    reuseExistingServer: true,
  },
});
