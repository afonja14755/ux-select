import { resolve } from 'path';
import { defineConfig } from 'vite';

function resDir(path: string) {
  return resolve(__dirname, path);
}

export default defineConfig({
  base: './',
  build: {
    target: 'es2020',
    sourcemap: true,
    rollupOptions: {
      output: {
        extend: true,
        assetFileNames: (assetInfo) => {
          return assetInfo.name === 'style.css' ? 'css/ux-select.css' : '[name][extname]';
        },
      },
    },
    lib: {
      entry: resDir('src/ux-select.ts'),
      name: 'ux-select',
      formats: ['es', 'iife'],
      fileName: (format, entryName) => {
        return `js/${entryName}.${format}.js`;
      },
    },
  },
});
