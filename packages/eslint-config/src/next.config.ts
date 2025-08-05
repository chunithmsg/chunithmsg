import { configs, plugins } from 'eslint-config-airbnb-extended';

import { defineConfig, prettierConfig } from './default.config';
import { getReactConfig } from './react.config';

export function getNextConfig(importMetaUrl: string) {
  return defineConfig([
    ...getReactConfig(importMetaUrl),

    // Next Plugin
    plugins.next,
    // Airbnb Next Recommended Config
    ...configs.next.recommended,
    // Airbnb Next TypeScript Config
    ...configs.next.typescript,

    ...prettierConfig,
  ]);
}
