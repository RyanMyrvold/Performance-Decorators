// jest.config.ts

import type { Config } from '@jest/types';

// Jest configuration for TypeScript with new decorator system
const config: Config.InitialOptions = {
  verbose: true,
  preset: 'ts-jest/presets/default-esm', // Use ESM preset for new decorator system
  testEnvironment: 'node',                // Or 'jsdom' if needed
  transform: {
    '^.+\\.tsx?$': ['ts-jest', {
      tsconfig: 'tsconfig.json',
      useESM: true,                        // Enable ESM if using ES modules
    }],
  },
  testRegex: '(/__tests__/.*|(\\.|/)(test|spec))\\.tsx?$',
  moduleFileExtensions: [
    'ts',
    'tsx',
    'js',
    'jsx',
    'json',
    'node'
  ],
  moduleNameMapper: {
    // If you use ESM modules, Jest might need to map certain modules
    // For example, handle any module aliases or asset imports here
    // Example:
    // '^@src/(.*)$': '<rootDir>/src/$1',
  },
  extensionsToTreatAsEsm: ['.ts'],           // Treat TypeScript files as ESM
  // Optional: If you use Babel alongside TypeScript, you might need its configuration as well
  // transform: {
  //   '^.+\\.(ts|tsx)$': 'ts-jest',
  //   '^.+\\.(js|jsx)$': 'babel-jest'
  // },
  // If you want to use Jest with React (enzyme), you can include enzyme setup here
  // setupFilesAfterEnv: ['./enzyme.setup.ts'],
  // If you use other assets like CSS or images, you can use moduleNameMapper to handle them
  // moduleNameMapper: {
  //   "\\.(css|less|scss|sss|styl)$": "<rootDir>/node_modules/jest-css-modules"
  // },
  // For any modules that are commonjs and might have issues with jest, force them to use the correct transformer
  // transformIgnorePatterns: [
  //   "/node_modules/(?!module-that-needs-transpiling/)"
  // ],
};

export default config;
