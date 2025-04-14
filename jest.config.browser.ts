import baseConfig from './jest.config.base';
import type { Config } from 'jest';

const config: Config = {
  ...baseConfig,
  displayName: 'browser',
  testEnvironment: 'jsdom',
  testMatch: ['<rootDir>/packages/browser/tests/**/*.(test|spec).ts'],
  globals: {
    'ts-jest': {
      ...(baseConfig.globals?.['ts-jest'] as Record<string, unknown>),
      tsconfig: '<rootDir>/packages/browser/tsconfig.browser.json'
    }
  }
};

export default config;
