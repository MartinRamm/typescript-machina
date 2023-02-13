module.exports = {
  clearMocks: true,
  coverageProvider: 'v8',
  roots: ['./test/unit'],
  testMatch: ['**/*.ts'],
  preset: 'ts-jest',
  globalSetup: './test/unit-setup/setup.ts',
  transform: {
    //eslint-disable-next-line @typescript-eslint/naming-convention
    '^.+\\.ts$': ['ts-jest', { tsconfig: './tsconfig-test.json' }],
  },
  verbose: true,
};
