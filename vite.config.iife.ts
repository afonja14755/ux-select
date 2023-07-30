import { resolve } from "path";
import { defineConfig } from "vite";

export default defineConfig({
  build: {
    emptyOutDir: false,
    target: "es2020",
    lib: {
      entry: resolve(__dirname, "src/ux-select.ts"),
      name: "UxSelect",
      fileName: "ux-select.min",
      formats: ["iife"],
    },
    rollupOptions: {
      output: {
        assetFileNames: "ux-select.min.[ext]",
      },
    },
  },
});
