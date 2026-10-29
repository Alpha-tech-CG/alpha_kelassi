// ESLint v9 flat config (remplace l'ancien .eslintrc, absent du dépôt).
// Un seul fichier à la racine : ESLint v9 remonte l'arborescence depuis le cwd,
// donc `eslint src` dans chaque package (web, mobile, types, ui) le trouve.
//
// Les règles de qualité sont en `warn` : elles remontent l'info sans faire
// échouer la CI sur du code pré-existant (aucun lint n'était configuré avant).
// On pourra les durcir progressivement.
import js from '@eslint/js'
import tsParser from '@typescript-eslint/parser'
import tsPlugin from '@typescript-eslint/eslint-plugin'

// Le plugin officiel @next/eslint-plugin-next n'est pas installé, mais le code
// contient des directives `eslint-disable @next/next/no-img-element`. On déclare
// la règle en no-op pour que ces directives se résolvent (sinon ESLint lève
// « Definition for rule ... was not found »).
const nextNextStub = { rules: { 'no-img-element': { create: () => ({}) } } }
// Idem pour react-hooks (plugin non installé) : directives présentes dans le code.
const reactHooksStub = {
  rules: {
    'exhaustive-deps': { create: () => ({}) },
    'rules-of-hooks': { create: () => ({}) },
  },
}

export default [
  {
    // Les directives `eslint-disable @next/next/*` et `react-hooks/*` du code
    // ciblent des plugins non installés (déclarés en no-op plus bas) : on ne
    // signale pas ces directives comme « inutilisées » (elles redeviendront
    // actives si les vrais plugins sont ajoutés).
    linterOptions: { reportUnusedDisableDirectives: 'off' },
  },
  {
    ignores: [
      '**/node_modules/**',
      '**/dist/**',
      '**/.next/**',
      '**/.expo/**',
      '**/build/**',
      '**/.turbo/**',
      '**/coverage/**',
      '**/web-stubs/**',
      '**/*.d.ts',
      '**/next-env.d.ts',
    ],
  },
  // TypeScript / TSX
  {
    files: ['**/*.{ts,tsx}'],
    languageOptions: {
      parser: tsParser,
      ecmaVersion: 'latest',
      sourceType: 'module',
      parserOptions: { ecmaFeatures: { jsx: true } },
    },
    plugins: {
      '@typescript-eslint': tsPlugin,
      '@next/next': nextNextStub,
      'react-hooks': reactHooksStub,
    },
    rules: {
      // no-undef est inutile en TS (le compilateur s'en charge) et produit
      // des faux positifs sur les types/globals.
      'no-undef': 'off',
      'no-unused-vars': 'off',
      '@typescript-eslint/no-unused-vars': [
        'warn',
        { argsIgnorePattern: '^_', varsIgnorePattern: '^_' },
      ],
      '@typescript-eslint/no-explicit-any': 'warn',
      '@typescript-eslint/no-non-null-assertion': 'off',
      'no-empty': ['warn', { allowEmptyCatch: true }],
      'prefer-const': 'warn',
    },
  },
  // Fichiers JS de config/outillage (eslint, metro, tailwind, next config, scripts)
  {
    files: ['**/*.{js,mjs,cjs}'],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
    },
    rules: {
      ...js.configs.recommended.rules,
      'no-undef': 'off',
      'no-unused-vars': 'warn',
      'no-empty': ['warn', { allowEmptyCatch: true }],
    },
  },
]
