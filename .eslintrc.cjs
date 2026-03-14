module.exports = {
  env: {
    browser: true,
    es2021: true,
    node: true,
    vitest: true
  },
  extends: [
    'eslint:recommended',
    'plugin:react/recommended',
    'plugin:react-hooks/recommended'
  ],
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
    ecmaFeatures: {
      jsx: true
    }
  },
  settings: {
    react: {
      version: 'detect'
    }
  },
  rules: {
    'react/react-in-jsx-scope': 'off',
    'react/prop-types': 'warn',
    'no-unused-vars': ['warn', {
      argsIgnorePattern: '^_',
      ignoreRestSiblings: true
    }],
    'prefer-const': 'warn',
    'no-console': ['warn', { allow: ['warn', 'error'] }]
  }
}
