module.exports = {
  root: true,
  env: {
    browser: true,
    es2022: true,
    node: true,
  },
  parser: '@typescript-eslint/parser',
  plugins: ['@typescript-eslint', 'react-hooks', 'react-refresh'],
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:react-hooks/recommended',
  ],
  ignorePatterns: ['dist', 'dist-electron', 'node_modules'],
  rules: {
    '@typescript-eslint/no-explicit-any': 'error',
    'react-refresh/only-export-components': 'off',
  },
  overrides: [
    {
      files: ['electron/**/*.ts'],
      env: {
        node: true,
        browser: false,
      },
    },
    {
      files: ['src/**/*.test.ts', 'src/**/*.test.tsx'],
      env: {
        browser: true,
      },
    },
  ],
};
