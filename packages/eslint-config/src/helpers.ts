import { existsSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { includeIgnoreFile } from '@eslint/compat';

import type { FlatConfig } from '@eslint/compat';

function getDirname(importMetaUrl: string) {
  const __filename = fileURLToPath(importMetaUrl);
  return path.dirname(__filename);
}

export function getGitIgnoreFiles(importMetaUrl: string): FlatConfig[] {
  // always include the root gitignore file
  const rootGitignorePath = fileURLToPath(
    new URL('../../../.gitignore', import.meta.url),
  );

  const ignoreFiles: FlatConfig[] = [includeIgnoreFile(rootGitignorePath)];

  const packageDir = getDirname(importMetaUrl);
  const packageGitignorePath = path.join(packageDir, '.gitignore');
  if (existsSync(packageGitignorePath)) {
    ignoreFiles.push(includeIgnoreFile(packageGitignorePath));
  }

  return ignoreFiles;
}
