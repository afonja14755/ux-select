import globals from 'globals'
import jsEslint from '@eslint/js'
import tsEslint from 'typescript-eslint'

export default [
  jsEslint.configs.recommended,
  ...tsEslint.configs.recommended,
  {
    ignores: ['**/dist/*']
  },
  {
    files: ['src/**/*.{js,ts}'],
    languageOptions: {
      ecmaVersion: 12,
      globals: {
        ...globals.browser,
        ...globals.node,
        ...globals.es2021
      }
    },
    rules: {
      'no-console': ['warn'],
      'indent': ['error', 2, { 'SwitchCase': 1 }],
      'quotes': ['error', 'single', { 'avoidEscape': true }],
      'spaced-comment': ['error', 'always'],
      'semi': ['error', 'never'],
      'object-curly-spacing': ['error', 'always'],
      'comma-dangle': ['error', 'never'],
      'eol-last': ['error', 'always'],
      'no-multiple-empty-lines': ['error', { 'max': 1, 'maxEOF': 0 }],
      'eqeqeq': ['error', 'always'],
      'no-var': ['error']
    }
  }
]
