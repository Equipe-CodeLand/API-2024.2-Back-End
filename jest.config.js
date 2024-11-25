module.exports = {
    preset: 'ts-jest',
    testEnvironment: 'node',
    transform: {
      '^.+\\.(ts|tsx)$': 'ts-jest',
      '^.+\\.(js|jsx)$': 'babel-jest',
    },
    moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
    setupFiles: ['dotenv/config'],
    testEnvironment: 'node',
    transformIgnorePatterns: ['/node_modules/'],
    maxWorkers: 1,
    runInBand: true,
    forceExit: true,
  };
  