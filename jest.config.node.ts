import baseConfig from './jest.config.base';
import type { Config } from '@jest/types';

const config: Config.InitialOptions = {
  ...baseConfig,
  displayName: 'node',
  testEnvironment: 'node',
  testMatch: ['<rootDir>/packages/node/tests/**/*.(test|spec).ts'],
  globals: {
    'ts-jest': {
      ...(baseConfig.globals?.['ts-jest'] as Record<string, unknown>),
      tsconfig: '<rootDir>/packages/node/tsconfig.json'
    }
  },
  moduleNameMapper: {
    ...baseConfig.moduleNameMapper,
    '^@node/(.*)$': '<rootDir>/packages/node/src/$1',
    '^@common/(.*)$': '<rootDir>/packages/common/src/$1'
  }
};

export default config;
