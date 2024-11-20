module.exports = {
    roots: ["<rootDir>/src"],
    moduleFileExtensions: ["js", "jsx", "ts", "tsx", "json"],
    transform: {
      "^.+\\.(ts|tsx)$": "ts-jest",
    },
    transformIgnorePatterns: ["<rootDir>/node_modules/"],
    moduleNameMapper: {
      "\\.(css|scss)$": "identity-obj-proxy",
      "\\.(jpg|jpeg|png|gif|webp|svg)$": "<rootDir>/__mocks__/fileMock.js",
    },
    testEnvironment: "node",
    testMatch: ["**/__tests__/**/*.+(ts|tsx|js)", "**/?(*.)+(spec|test).+(ts|tsx|js)"],
    collectCoverage: true,
    collectCoverageFrom: [
      "src/**/*.{ts,tsx}",
      "!src/**/*.d.ts",
      "!src/**/index.ts",
    ],
    coverageDirectory: "coverage",
    testTimeout: 30000,
    setupFiles: ['dotenv/config'],
  };
  