module.exports = {
  parserOptions: {
    ecmaVersion: 2021,
    sourceType: 'module',
    ecmaFeatures: {
      jsx: true,
    },
  },
  env: {
    browser: true,
    node: true,
    es2021: true,
  },
  extends: ['eslint:recommended', 'plugin:react/recommended'],
  rules: {
    'react/prop-types': 'off', // Si vous ne souhaitez pas utiliser les propTypes
  },
};
