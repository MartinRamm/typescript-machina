/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  clearMocks: true,
  testEnvironment: 'node',
  coverageProvider: 'v8',
  testMatch: ['<rootDir>/test/unit/**/*.ts'],
  globalSetup: './test/unit-setup/setup.ts',

  transform: {
    //eslint-disable-next-line @typescript-eslint/naming-convention
    '^.+\\.ts$': ['ts-jest', { tsconfig: './tsconfig-test.json' }],
  },
  verbose: true,
};
