module.exports = {
  env: {
    es2021: true,
    node: true,
  },
  extends: [
    'airbnb-base',
  ],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 12,
    sourceType: 'module',
  },
  plugins: [
    '@typescript-eslint',
  ],
  rules: {
    'no-console': 0,
    'max-len': [
      'error',
      {
        ignoreComments: true,
        code: 120,
      },
    ],
    'no-unused-vars': 0,
    '@typescript-eslint/no-unused-vars': ['error'],
    'no-cond-assign': 0, // I know what I'm doing
  },
};
