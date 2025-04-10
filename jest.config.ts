import type { Config } from '@jest/types';

// Jest configuration for a TypeScript monorepo with ESM and decorators
const config: Config.InitialOptions = {
  verbose: true,
  preset: 'ts-jest/presets/default-esm', // Use ESM preset for compatibility with TypeScript and decorators
  testEnvironment: 'node',              // Use 'jsdom' if testing browser-specific code
  transform: {
    '^.+\\.tsx?$': ['ts-jest', {
      tsconfig: './tsconfig.json',       // Ensure the correct tsconfig.json is used
      useESM: true                      // Enable ESM for TypeScript files
    }]
  },
  testRegex: '^.*/tests/.*\\.(test|spec)\\.tsx?$', // Match test files in `tests` folder
  moduleFileExtensions: [
    'ts',
    'tsx',
    'js',
    'jsx',
    'json',
    'node'
  ],
  moduleNameMapper: {
    '^@common/(.*)$': '<rootDir>/packages/common/src/$1',  // Alias for common package
    '^@node/(.*)$': '<rootDir>/packages/node/src/$1',      // Alias for Node.js-specific package
    '^@browser/(.*)$': '<rootDir>/packages/browser/src/$1' // Alias for browser-specific package
  },
  extensionsToTreatAsEsm: ['.ts'],        // Treat `.ts` files as ESM
  transformIgnorePatterns: [
    '/node_modules/(?!.*\\.mjs$)'         // Transform `.mjs` files in node_modules if needed
  ],
  collectCoverage: true,                  // Enable coverage collection
  collectCoverageFrom: [
    'packages/**/*.{ts,tsx}',             // Collect coverage from all packages
    '!**/node_modules/**',                // Exclude node_modules
    '!**/dist/**'                         // Exclude build output
  ],
  coverageDirectory: '<rootDir>/coverage', // Output coverage reports to a unified directory
  setupFiles: [],                         // Add any global setup files if needed
  globals: {
    'ts-jest': {
      isolatedModules: true,             // Speed up tests by avoiding full type-checking
      diagnostics: false                 // Suppress TypeScript diagnostics during tests
    }
  }
};

export default config;