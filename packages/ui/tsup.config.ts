import { defineConfig } from 'tsup';

export default defineConfig((options) => {
  return {
    entry: ['src/**/*'],
    format: ['cjs', 'esm'],
    splitting: false,
    dts: true,
    outDir: 'dist',
    minify: !options.watch,
    sourcemap: !options.watch,
    clean: true,
  };
});
