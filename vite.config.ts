import { resolve } from 'path'
import { defineConfig } from 'vite'

export default defineConfig({
  base: './',
  build: {
    target: 'es2020',
    sourcemap: true,
    rollupOptions: {
      output: {
        extend: true,
        assetFileNames: (assetInfo) => {
          return assetInfo.name === 'style.css' ? 'css/ux-select.css' : '[name][extname]'
        }
      }
    },
    lib: {
      entry: resolve(__dirname, 'src/ux-select.ts'),
      name: 'UxSelect',
      formats: ['es', 'iife'],
      fileName: (format, entryName) => {
        return `js/${entryName}.${format}.js`
      }
    }
  }
})
