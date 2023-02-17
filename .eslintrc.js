module.exports = {
  env: {
    node: true,
    es2021: true,
  },
  extends: [
    "eslint:recommended",
    'plugin:@typescript-eslint/recommended',
    'prettier',
  ],
  parser: "@typescript-eslint/parser",
  parserOptions: {
    ecmaVersion: 'latest',
  },
  plugins: ['@typescript-eslint', 'prettier'],
  rules: {
    '@typescript-eslint/no-explicit-any':"off",
    'prettier/prettier': 2,
    'no-var': 'error',
    'no-use-before-define': 'error'
  },
}
