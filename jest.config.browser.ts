import baseConfig from './jest.config.base';
import type { Config } from '@jest/types';

const baseTransform = baseConfig.transform ?? {};
const tsJestEntry = baseTransform['^.+\\.tsx?$'];
const browserTsJestTransform = Array.isArray(tsJestEntry)
  ? [
      tsJestEntry[0],
      {
        ...(tsJestEntry[1] as Record<string, unknown>),
        tsconfig: '<rootDir>/packages/browser/tsconfig.spec.json'
      }
    ]
  : tsJestEntry;

const config: Config.InitialOptions = {
  ...baseConfig,
  displayName: 'browser',
  testEnvironment: 'node',
  testMatch: ['<rootDir>/packages/browser/tests/**/*.(test|spec).ts'],
  setupFilesAfterEnv: ['<rootDir>/jest.setup.browser.ts'],
  transform: {
    ...baseTransform,
    '^.+\\.tsx?$': browserTsJestTransform as Config.TransformerConfig
  },
  moduleNameMapper: {
    ...baseConfig.moduleNameMapper,
    '^@browser/(.*)$': '<rootDir>/packages/browser/src/$1',
    '^@common/(.*)$': '<rootDir>/packages/common/src/$1'
  }
};

export default config;
