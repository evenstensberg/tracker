module.exports = {
  setupFiles: ['<rootDir>/src/setupEnv.js'],
  collectCoverage: false,
  collectCoverageFrom: ['src/**/*.js'],
  coveragePathIgnorePatterns: [
    'node_modules',
    'test-config',
    'jestGlobalMocks.js',
    '.module.js',
    'locale',
    'index.js',
    'env.js',
  ],
  testTimeout: 120000,
}
