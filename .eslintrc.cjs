/* eslint-env node */
module.exports = {
  extends: ["eslint:recommended", "plugin:@typescript-eslint/recommended"],
  parser: "@typescript-eslint/parser",
  parserOptions: { project: "./tsconfig.json" },
  plugins: ["@typescript-eslint"],
  root: true,
  rules: {
    "no-console": 2,
  },
  env: {
    browser: true,
    es2020: true,
  },
};
