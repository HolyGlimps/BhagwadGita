import js from '@eslint/js';
import tsParser from '@typescript-eslint/parser';

export default [
  {
    ignores: [
      '.next/**',
      'node_modules/**',
      'build/**',
      'dist/**',
      '.eslintrc.json',
    ],
  },
  js.configs.recommended,
  {
    files: ['**/*.{ts,tsx,js,jsx}'],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      parser: tsParser,
      parserOptions: {
        ecmaFeatures: {
          jsx: true,
        },
      },
      env: {
        browser: true,
        node: true,
      },
      globals: {
        console: "readonly",
        process: "readonly",
        setTimeout: "readonly",
        setInterval: "readonly",
        clearTimeout: "readonly",
        clearInterval: "readonly",
        HTMLDivElement: "readonly",
        MouseEvent: "readonly",
        Event: "readonly",
        Node: "readonly",
      },
    },
    rules: {
      'prefer-const': 'error',
      'no-var': 'error',
    },
  },
  {
    files: ['pages/api/**/*.{ts,tsx,js,jsx}'],
    languageOptions: {
      globals: {
        process: 'readonly',
        Buffer: 'readonly',
      },
      env: {
        node: true,
      },
    },
  },
];