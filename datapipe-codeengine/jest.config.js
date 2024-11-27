module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  rootDir: './server',
  collectCoverage: true,
  coverageThreshold: {
    global: {
      branches: 100,
      functions: 100,
      lines: 100,
      statements: 100
    }
  },
  coverageReporters: [
    'text',
    'text-summary',
    'html',
    'lcov'
  ],
  coverageDirectory: '../coverage',
  testPathIgnorePatterns: [
    '<rootDir>/server/config/',
    '<rootDir>/server/express.ts',
    '<rootDir>/server/app.ts',
  ],
  collectCoverageFrom: [
    '**/*.ts',
    '!**/config/**',
    '!**/express.ts',
    '!**/app.ts',
  ],
  reporters: [
    'default'
  ],
  resetMocks: true,
  restoreMocks: true,
};
