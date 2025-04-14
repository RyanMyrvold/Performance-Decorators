import type { Config } from '@jest/types';

const config: Config.InitialOptions = {
  displayName: 'browser',
  preset: 'ts-jest/presets/default-esm',
  testEnvironment: 'jsdom',
  testMatch: ['<rootDir>/packages/browser/tests/**/*.(test|spec).ts'],
  transform: {
    '^.+\\.tsx?$': [
      'ts-jest',
      {
        useESM: true,
        tsconfig: '<rootDir>/packages/browser/tsconfig.browser.json'
      }
    ]
  },
  moduleNameMapper: {
    '^@common/(.*)$': '<rootDir>/packages/common/src/$1',
    '^@browser/(.*)$': '<rootDir>/packages/browser/src/$1'
  },
  extensionsToTreatAsEsm: ['.ts'],
  transformIgnorePatterns: ['/node_modules/(?!.*\\.mjs$)'],
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
  globals: {
    'ts-jest': {
      isolatedModules: true,
      diagnostics: false
    }
  }
};

export default config;
