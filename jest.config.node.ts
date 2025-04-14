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
      tsconfig: '<rootDir>/packages/node/tsconfig.node.json'
    }
  }
};

export default config;
