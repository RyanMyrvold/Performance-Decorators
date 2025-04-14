import baseConfig from './jest.config.base';
import type { Config } from '@jest/types';

const config: Config.InitialOptions = {
  ...baseConfig,
  displayName: 'browser',
  testEnvironment: 'jsdom',
  testMatch: ['<rootDir>/packages/browser/tests/**/*.(test|spec).ts'],
  globals: {
    'ts-jest': {
      ...baseConfig.globals?.['ts-jest'],
      tsconfig: '<rootDir>/packages/browser/tsconfig.browser.json'
    }
  }
};

export default config;
