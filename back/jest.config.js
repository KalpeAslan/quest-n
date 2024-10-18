module.exports = {
  rootDir: '.',
  testRegex: './test/*/.*.test.ts$',
  transform: {
    '^.+\\.(ts|tsx)?$': 'ts-jest',
  },
  testEnvironment: 'node',
  testPathIgnorePatterns: ['data_volumes', 'node_modules'],
  collectCoverage: false,
  testResultsProcessor: 'jest-sonar-reporter',
  coveragePathIgnorePatterns: ['/node_modules/', '/data_volumes/', '/data_volumes_test/', '/terraform/', '/test/'],
  testTimeout: 200000,
  testSequencer: './test/testSequencer.js',
};
