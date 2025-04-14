import type { Config } from 'jest';

const baseConfig: Config = {
  preset: 'ts-jest/presets/default-esm',

  transform: {
    '^.+\\.tsx?$': [
      'ts-jest',
      {
        useESM: true
      }
    ]
  },

  extensionsToTreatAsEsm: ['.ts'],
  transformIgnorePatterns: ['/node_modules/(?!.*\\.mjs$)'],

  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],

  moduleNameMapper: {
    '^@common/(.*)$': '<rootDir>/packages/common/src/$1',
    '^@node/(.*)$': '<rootDir>/packages/node/src/$1',
    '^@browser/(.*)$': '<rootDir>/packages/browser/src/$1'
  },

  globals: {
    'ts-jest': {
      useESM: true,
      isolatedModules: true,
      diagnostics: false
    }
  }
};

export default baseConfig;
