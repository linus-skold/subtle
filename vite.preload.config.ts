// vite.electron.config.ts
import { defineConfig } from 'vite';
import path from 'path';
import { builtinModules } from 'module';

export default defineConfig({
    build: {
      target: 'node18',
      outDir: 'build',
      emptyOutDir: false,
      lib: {
        entry: path.resolve(__dirname, 'apps/electron/src/preload.ts'),
        formats: ['cjs'], // ❗ CJS for preload
      },
      rollupOptions: {
        external: ['electron', ...builtinModules],
        output: {
          entryFileNames: 'preload.js',
          format: 'cjs',
        },
      },
    },
});
