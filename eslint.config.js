import js from '@eslint/js';
import globals from 'globals';
import reactHooks from 'eslint-plugin-react-hooks';
import tseslint from 'typescript-eslint';

export default tseslint.config(
  { ignores: ['dist', 'node_modules', 'playwright-report', 'test-results'] },
  {
    files: ['**/*.{ts,tsx}'],
    extends: [js.configs.recommended, ...tseslint.configs.recommended],
    languageOptions: { globals: { ...globals.browser, ...globals.node } },
    plugins: { 'react-hooks': reactHooks },
    rules: {
      ...reactHooks.configs.recommended.rules,
      // Espaces insécables voulues (typographie française) dans les textes uniquement.
      'no-irregular-whitespace': [
        'error',
        { skipStrings: true, skipTemplates: true, skipJSXText: true, skipRegExps: true },
      ],
    },
  },
  { files: ['scripts/**/*.mjs'], languageOptions: { globals: globals.node } },
);
