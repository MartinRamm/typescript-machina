/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  clearMocks: true,
  testEnvironment: 'node',
  coverageReporters: ['html'],
  coverageDirectory: '.coverage',
  collectCoverage: true,
  coverageProvider: 'v8',
  coverageThreshold: {
    global: {
      branches: 100,
      functions: 100,
      lines: 100,
      statements: 100,
    },
  },
  collectCoverageFrom: ['<rootDir>/src/**/*.ts'],
  coveragePathIgnorePatterns: ['.d.ts$'],
  testMatch: ['<rootDir>/test/unit/**/*.ts'],
  globalSetup: './test/unit-setup/setup.ts',

  transform: {
    //eslint-disable-next-line @typescript-eslint/naming-convention
    '^.+\\.ts$': [
      'ts-jest',
      {
        tsconfig: './tsconfig-test.json',
        diagnostics: {
          warnOnly: true, //pnpm run test also runs tsc, therefore this is ok. this was introduced as expectTypeOf of an inferred type didn't work within jest, but worked correctly with tsc.
        },
      },
    ],
  },
  verbose: true,
};
