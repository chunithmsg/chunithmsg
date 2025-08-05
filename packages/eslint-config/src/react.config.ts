import { configs, plugins } from 'eslint-config-airbnb-extended';

import { defineConfig, getConfig, prettierConfig } from './default.config';

export function getReactConfig(importMetaUrl: string) {
  return defineConfig([
    ...getConfig(importMetaUrl),

    // React Plugin
    plugins.react,
    // React Hooks Plugin
    plugins.reactHooks,
    // React JSX A11y Plugin
    plugins.reactA11y,
    // Airbnb React Recommended Config
    ...configs.react.recommended,

    {
      rules: {
        'react/function-component-definition': [
          'error',
          {
            namedComponents: 'arrow-function',
            unnamedComponents: 'arrow-function',
          },
        ],
      },
    },

    ...prettierConfig,
  ]);
}
