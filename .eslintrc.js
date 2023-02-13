const { resolve } = require('path');

module.exports = {
  root: true,
  parserOptions: {
    parser: '@typescript-eslint/parser',
    project: [resolve(__dirname, './tsconfig.json'), resolve(__dirname, './tsconfig-test.json')],
    tsconfigRootDir: __dirname,
    ecmaVersion: 6, // Allows for the parsing of modern ECMAScript features
    sourceType: 'module', // Allows for the use of imports
  },

  env: {
    node: true,
  },

  extends: [
    'eslint:recommended',

    'plugin:@typescript-eslint/recommended',
    'plugin:@typescript-eslint/recommended-requiring-type-checking',

    'prettier',

    'plugin:security/recommended',
  ],

  plugins: ['@typescript-eslint', 'prettier', 'import', 'filenames', 'security'],

  // add your custom rules here
  rules: {
    '@typescript-eslint/no-unused-vars': 'off',
    '@typescript-eslint/no-explicit-any': 'off',

    'prefer-promise-reject-errors': 'off',

    '@typescript-eslint/ban-ts-comment': [
      'error',
      {
        'ts-expect-error': 'allow-with-description',
        'ts-ignore': false,
        'ts-nocheck': false,
        'ts-check': false,
        minimumDescriptionLength: 15,
      },
    ],

    quotes: ['error', 'single', { avoidEscape: true }],

    'prettier/prettier': 'error',
    'linebreak-style': ['error', 'unix'],

    'import/no-default-export': 2,
    'import/no-relative-packages': 'error',

    'filenames/match-exported': 2,

    '@typescript-eslint/naming-convention': [
      'error',
      {
        selector: 'default',
        format: ['camelCase'],
        leadingUnderscore: 'forbid',
        trailingUnderscore: 'forbid',
        filter: {
          regex: '(__brand|_onEnter|_onExit)',
          match: false,
        },
      },

      {
        selector: 'variable',
        format: ['camelCase', 'UPPER_CASE'],
        leadingUnderscore: 'forbid',
        trailingUnderscore: 'forbid',
      },
      {
        selector: 'parameter',
        format: ['camelCase'],
        leadingUnderscore: 'allow', //to skip "unused parameter" ts error
        trailingUnderscore: 'forbid',
      },

      {
        selector: 'memberLike',
        modifiers: ['static'],
        format: ['camelCase', 'PascalCase'],
        leadingUnderscore: 'forbid',
        trailingUnderscore: 'forbid',
      },

      {
        selector: 'memberLike',
        modifiers: ['private'],
        format: ['camelCase'],
        leadingUnderscore: 'forbid',
        trailingUnderscore: 'forbid',
      },

      {
        selector: 'typeLike',
        format: ['PascalCase'],
        leadingUnderscore: 'forbid',
        trailingUnderscore: 'forbid',
      },

      {
        selector: 'enum',
        format: ['UPPER_CASE'],
        leadingUnderscore: 'forbid',
        trailingUnderscore: 'forbid',
        suffix: ['_ENUM'],
      },
      {
        selector: 'enumMember',
        format: ['UPPER_CASE'],
        leadingUnderscore: 'forbid',
        trailingUnderscore: 'forbid',
      },
    ],
  },
  overrides: [
    {
      files: ['*.js'],
      rules: {
        '@typescript-eslint/no-unsafe-call': 'off',
        '@typescript-eslint/no-unsafe-argument': 'off',
        '@typescript-eslint/no-unsafe-return': 'off',
        '@typescript-eslint/no-var-requires': 'off',
        '@typescript-eslint/no-unsafe-assignment': 'off',
        '@typescript-eslint/restrict-template-expressions': 'off',
        '@typescript-eslint/no-unsafe-member-access': 'off',
        '@typescript-eslint/unbound-method': 'off',
      },
    },
    {
      files: ['.eslintrc.js'],
      rules: {
        '@typescript-eslint/naming-convention': 'off',
      },
    },
    {
      files: ['**/test/unit/*.ts'],
      plugins: ['jest'],
      extends: 'plugin:jest/recommended',
      rules: {
        'jest/valid-title': 'off',
        'jest/prefer-expect-assertions': 'off',
        'jest/consistent-test-it': [
          'error',
          {
            fn: 'test',
            withinDescribe: 'test',
          },
        ],
        'no-restricted-properties': [
          'error',
          {
            object: 'test',
            property: 'each',
            message: 'Please use `[...].forEach((each) => { test(...) });` instead, as `test.each` is not typed.',
          },
        ],
      },
    },
  ],
};
