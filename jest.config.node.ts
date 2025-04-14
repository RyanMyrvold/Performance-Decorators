import type { Config } from '@jest/types';

const config: Config.InitialOptions = {
  displayName: 'node',
  verbose: true,
  preset: 'ts-jest/presets/default-esm',
  testEnvironment: 'node',
  testMatch: ['<rootDir>/packages/node/tests/**/*.(test|spec).ts'],
  transform: {
    '^.+\\.tsx?$': [
      'ts-jest',
      {
        useESM: true,
        tsconfig: '<rootDir>/packages/node/tsconfig.node.json'
      }
    ]
  },
  moduleNameMapper: {
    '^@common/(.*)$': '<rootDir>/packages/common/src/$1',
    '^@node/(.*)$': '<rootDir>/packages/node/src/$1'
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
