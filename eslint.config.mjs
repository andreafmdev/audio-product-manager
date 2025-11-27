import typescriptEslintEslintPlugin from '@typescript-eslint/eslint-plugin';
import tsParser from '@typescript-eslint/parser';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { FlatCompat } from '@eslint/eslintrc';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const compat = new FlatCompat({
  baseDirectory: __dirname,
});

export default [
  {
    ignores: [
      'node_modules/**',
      'dist/**',
      '*.js',
      'test/**',
      'coverage/**',
      '*.config.js',
      '*.config.mjs',
    ],
  },
  ...compat.extends(
    'plugin:@typescript-eslint/recommended',
    'plugin:prettier/recommended',
  ),
  
  {
    files: ['src/**/*.{ts,tsx}'],

    plugins: {
      '@typescript-eslint': typescriptEslintEslintPlugin,
    },
    languageOptions: {
      parser: tsParser,
      ecmaVersion: 5,
      parserOptions: {
        project: 'tsconfig.json',
      },
    },
  },
];
