// vite.electron.config.ts
import { defineConfig } from 'vite';
import path from 'path';
import { builtinModules } from 'module';

export default defineConfig({
  build: {
    outDir: 'build',
    emptyOutDir: true,
    target: 'esnext',
    lib: {
      entry: path.resolve(__dirname, 'apps/electron/src/main.ts'),
      formats: ['es'],
    },
    rollupOptions: {
      external: [
        'electron',
        'better-sqlite3',
        ...builtinModules,
      ],
      output: {
        entryFileNames: '[name].js',
        chunkFileNames: '[name].js',
        format: 'es',
      },
    },
  },
  resolve: {
    alias: {
      '@db': path.resolve(__dirname, 'apps/db'),
      '@': path.resolve(__dirname, 'apps/electron/src'),
    },
  },
});
