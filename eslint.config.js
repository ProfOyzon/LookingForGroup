import js from '@eslint/js';
import globals from 'globals';
import { defineConfig } from 'eslint/config';
import eslintConfigPrettier from 'eslint-config-prettier';
import jestPlugin from 'eslint-plugin-jest';

export default defineConfig([
  {
    files: ['server/test/*.test.js'],
    plugins: { Jest: jestPlugin },
    languageOptions: { globals: jest.environments.globals.globals },
    ...jest.configs['flat/recommended'],
  },
  {
    files: ['server/**/*.js'],
    plugins: { js },
    extends: ['js/recommended'],
    languageOptions: { globals: globals.node },
    eslintConfigPrettier,
  },
]);
