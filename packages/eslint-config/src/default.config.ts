import type { ESLint } from 'eslint';
import eslint from '@eslint/js';
import { configs, plugins } from 'eslint-config-airbnb-extended';
import eslintPrettierConfig from 'eslint-config-prettier';
import turboConfig from 'eslint-config-turbo/flat';
import { createTypeScriptImportResolver } from 'eslint-import-resolver-typescript';
import { createNodeResolver } from 'eslint-plugin-import-x';
import prettierPlugin from 'eslint-plugin-prettier';
import { defineConfig } from 'eslint/config';

import { getGitIgnoreFiles } from './helpers';

const prettierConfig: {
  name: string;
  plugins?: Record<string, ESLint.Plugin>;
  rules?: Record<string, any>;
}[] = [
  // Prettier should be last to override other formatting rules
  // Prettier Plugin
  {
    name: 'prettier/plugin/config',
    plugins: {
      prettier: prettierPlugin,
    },
  },
  // Prettier Config
  {
    name: 'prettier/config',
    rules: {
      ...eslintPrettierConfig.rules,
      'prettier/prettier': 'error',
    },
  },
];

export { defineConfig, prettierConfig };

export function getConfig(importMetaUrl: string) {
  return defineConfig([
    ...getGitIgnoreFiles(importMetaUrl),

    // Global Ignores
    {
      ignores: [
        '.*.{js,cjs}',
        '**/*.{js,cjs}',
        '**/node_modules/**',
        '**/dist/**',
        'eslint.config.ts',
        '**/eslint.config.ts',
        '**/worker-configuration.d.ts',
      ],
    },

    // ESLint Recommended Rules
    {
      name: 'js/config',
      ...eslint.configs.recommended,
    },
    // Import X Plugin
    plugins.importX,
    // Turbo Config
    ...turboConfig,
    // Airbnb Base Recommended Config
    ...configs.base.recommended,
    // TypeScript ESLint Plugin
    plugins.typescriptEslint,
    // Airbnb Base TypeScript Config
    ...configs.base.typescript,

    {
      rules: {
        '@typescript-eslint/consistent-type-definitions': 'off',
        'no-param-reassign': 'off',
        'import-x/prefer-default-export': 'off',
        'import-x/extensions': [
          'error',
          'always',
          {
            js: 'never',
            cjs: 'never',
            mjs: 'never',
            jsx: 'never',
            ts: 'never',
            cts: 'never',
            mts: 'never',
            tsx: 'never',
          },
        ],
        'import-x/no-extraneous-dependencies': [
          'error',
          {
            devDependencies: ['**/*.config.{js,cjs,mjs,ts}'],
          },
        ],
        'prefer-spread': 'warn',
      },
    },

    {
      settings: {
        'import-x/resolver-next': [
          createTypeScriptImportResolver(),
          createNodeResolver(),
        ],
      },
    },

    ...prettierConfig,
  ]);
}
