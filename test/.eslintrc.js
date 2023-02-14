// eslint-disable-next-line no-undef
module.exports = {
  root: false,
  overrides: [
    {
      files: ['./**/*.ts'],
      rules: {
        '@typescript-eslint/no-empty-function': 'off',
      },
    },
  ],
};
