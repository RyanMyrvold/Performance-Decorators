import baseConfig from './jest.config.base';
import type { Config } from '@jest/types';

const config: Config.InitialOptions = {
  ...baseConfig,
  displayName: 'browser',
  testEnvironment: 'jsdom',
  testMatch: ['<rootDir>/packages/browser/tests/**/*.(test|spec).ts'],
  globals: {
    'ts-jest': {
      ...(baseConfig.globals?.['ts-jest'] as Record<string, unknown>),
      tsconfig: '<rootDir>/packages/browser/tsconfig.json'
    }
  },
  moduleNameMapper: {
    ...baseConfig.moduleNameMapper,
    '^@browser/(.*)$': '<rootDir>/packages/browser/src/$1',
    '^@common/(.*)$': '<rootDir>/packages/common/src/$1'
  }
};

export default config;
