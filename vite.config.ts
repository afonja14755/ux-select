import { resolve } from "path";
import { defineConfig } from "vite";
import cssInjectedByJsPlugin from "vite-plugin-css-injected-by-js";

export default defineConfig({
  plugins: [cssInjectedByJsPlugin()],
  build: {
    emptyOutDir: false,
    target: "es2020",
    lib: {
      entry: resolve(__dirname, "src/ux-select.ts"),
      name: "UxSelect",
      fileName: "ux-select.min",
    },
  },
});
