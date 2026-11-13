/// <reference types="vitest/config" />
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// base './' : chemins relatifs, fonctionne dans n'importe quel sous-répertoire GitHub Pages.
export default defineConfig({
  base: './',
  plugins: [react()],
  build: { target: 'es2020', assetsInlineLimit: 0, sourcemap: false },
  test: {
    environment: 'jsdom',
    include: ['tests/unit/**/*.test.{ts,tsx}'],
    setupFiles: ['tests/unit/setup.ts'],
  },
});
