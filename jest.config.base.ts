import type { Config } from '@jest/types';
import node from './jest.config.node';
import browser from './jest.config.browser';

const config: Config.InitialOptions = {
  projects: [node, browser],
  collectCoverage: true,
  collectCoverageFrom: [
    'packages/**/*.{ts,tsx}',
    '!**/node_modules/**',
    '!**/dist/**',
    '!**/tests/**'
  ],
  coverageDirectory: '<rootDir>/coverage'
};

export default config;
