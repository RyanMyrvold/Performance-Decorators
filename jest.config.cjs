/** @type {import('jest').Config} */
module.exports = {
  testEnvironment: "node",
  roots: ["<rootDir>/tests"],
  testMatch: ["**/?(*.)+(spec|test).ts"],
  transform: {
    "^.+\\.(ts|tsx)$": [
      "ts-jest",
      {
        tsconfig: "tsconfig.test.json",
        isolatedModules: true,
      },
    ],
  },
  moduleFileExtensions: ["ts", "tsx", "js", "jsx", "json", "node"],

  // Auto-reset and cleanup
  clearMocks: true,
  resetMocks: true,
  restoreMocks: true,
  resetModules: true,

  setupFilesAfterEnv: ["<rootDir>/tests/setupTests.ts"],

  testTimeout: 15000,
};
