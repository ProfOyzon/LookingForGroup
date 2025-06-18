import js from '@eslint/js';
import globals from 'globals';
import { defineConfig } from 'eslint/config';
import eslintConfigPrettier from 'eslint-config-prettier';
import jestPlugin from 'eslint-plugin-jest';

export default defineConfig([
  {
    files: ['tests'],
    plugins: { jest: jestPlugin },
    languageOptions: { globals: jestPlugin.environments.globals.globals },
    ...jestPlugin.configs['flat/recommended'],
  },
  {
    files: ['src'],
    plugins: { js },
    extends: ['js/recommended'],
    languageOptions: { globals: globals.node },
    ...eslintConfigPrettier,
  },
]);
