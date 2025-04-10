import type { Config } from '@jest/types';

const config: Config.InitialOptions = {
  verbose: true,
  preset: 'ts-jest/presets/default-esm',
  transform: {
    '^.+\\.tsx?$': ['ts-jest', {
      useESM: true,
      tsconfig: '<rootDir>/tsconfig.base.json'
    }]
  },
  testMatch: ['<rootDir>/packages/**/tests/**/*.(test|spec).ts'],
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
  moduleNameMapper: {
    '^@common/(.*)$': '<rootDir>/packages/common/src/$1',
    '^@node/(.*)$': '<rootDir>/packages/node/src/$1',
    '^@browser/(.*)$': '<rootDir>/packages/browser/src/$1'
  },
  extensionsToTreatAsEsm: ['.ts'],
  transformIgnorePatterns: ['/node_modules/(?!.*\\.mjs$)'],
  collectCoverage: true,
  collectCoverageFrom: [
    'packages/**/*.{ts,tsx}',
    '!**/node_modules/**',
    '!**/dist/**',
    '!**/tests/**'
  ],
  coverageDirectory: '<rootDir>/coverage',
  globals: {
    'ts-jest': {
      isolatedModules: true,
      diagnostics: false
    }
  }
};

export default config;
