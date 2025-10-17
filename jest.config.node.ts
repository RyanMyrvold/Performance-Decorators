import baseConfig from './jest.config.base';
import type { Config } from '@jest/types';

const baseTransform = baseConfig.transform ?? {};
const tsJestEntry = baseTransform['^.+\\.tsx?$'];
const nodeTsJestTransform = Array.isArray(tsJestEntry)
  ? [
      tsJestEntry[0],
      {
        ...(tsJestEntry[1] as Record<string, unknown>),
        tsconfig: '<rootDir>/packages/node/tsconfig.spec.json'
      }
    ]
  : tsJestEntry;

const config: Config.InitialOptions = {
  ...baseConfig,
  displayName: 'node',
  testEnvironment: 'node',
  testMatch: ['<rootDir>/packages/node/tests/**/*.(test|spec).ts'],
  transform: {
    ...baseTransform,
    '^.+\\.tsx?$': nodeTsJestTransform as Config.TransformerConfig
  },
  moduleNameMapper: {
    ...baseConfig.moduleNameMapper,
    '^@node/(.*)$': '<rootDir>/packages/node/src/$1',
    '^@common/(.*)$': '<rootDir>/packages/common/src/$1'
  }
};

export default config;
