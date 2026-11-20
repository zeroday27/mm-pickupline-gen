import js from '@eslint/js';
import globals from 'globals';
import react from 'eslint-plugin-react';

export default [
  { ignores: ['**/node_modules/**', 'dist/**', '.wrangler/**'] },
  js.configs.recommended,
  { files: ['**/*.{js,jsx,mjs,cjs}'], languageOptions: { globals: globals.node },
    rules: { 'no-unused-vars': ['error', { caughtErrors: 'none' }] } },
  { files: ['src/**/*.{js,jsx}', 'tests/browser/*.js'], plugins: { react }, languageOptions: {
    globals: globals.browser, parserOptions: { ecmaFeatures: { jsx: true } }
  }, rules: { 'react/jsx-uses-vars': 'error', 'react/jsx-uses-react': 'error', 'react/jsx-no-undef': 'error' } },
  // Data-generation templates intentionally share a positional callback signature.
  { files: ['backend/src/scripts/generate*Batch.js'], rules: {
    'no-unused-vars': ['error', { args: 'none' }]
  } },
  { files: ['worker/**/*.js'], languageOptions: { globals: globals.worker } }
];
