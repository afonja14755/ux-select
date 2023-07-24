import { resolve } from "path";
import { defineConfig } from "vite";

export default defineConfig({
  build: {
    lib: {
      entry: resolve(__dirname, "src/ux-select.ts"),
      name: "UxSelect",
      fileName: "ux-select.min",
      formats: ["es", "iife"],
    },
    rollupOptions: {
      output: {
        assetFileNames: "ux-select.min.[ext]",
      },
    },
  },
});
