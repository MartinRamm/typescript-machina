// eslint-disable-next-line no-undef
module.exports = {
  root: false,
  overrides: [
    {
      files: ['./**/*.ts'],
      plugins: ['jest'],
      extends: 'plugin:jest/recommended',
      rules: {
        'jest/valid-title': 'off',
        'jest/prefer-expect-assertions': 'off',
        'jest/expect-expect': 'off',
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
