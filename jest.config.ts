import nextJest from 'next/jest';

const createJestConfig = nextJest({
  dir: './',
});

const config = {
  projects: [
    {
      displayName: 'client',
      testEnvironment: 'jest-environment-jsdom',
      testMatch: ['<rootDir>/app/**/*.spec.{ts,tsx}'],
      setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],
      moduleNameMapper: {
        '^@/(.*)$': '<rootDir>/$1',
        '^__mock__/(.*)$': '<rootDir>/__mock__/$1',
      },
      transform: {
        '^.+\\.(ts|tsx)$': ['ts-jest', { tsconfig: '<rootDir>/tsconfig.json' }],
      },
    },
    {
      displayName: 'server',
      testEnvironment: 'node',
      testMatch: ['<rootDir>/core/**/*.test.ts'],
      moduleNameMapper: {
        '^@/(.*)$': '<rootDir>/$1',
      },
      transform: {
        '^.+\\.ts$': ['ts-jest', { tsconfig: '<rootDir>/tsconfig.json' }],
      },
    },
    {
      displayName: 'api-actions',
      testEnvironment: 'node',
      testMatch: ['<rootDir>/app/**/*.test.ts'],
      setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],
      moduleNameMapper: {
        '^@/(.*)$': '<rootDir>/$1',
      },
      transformIgnorePatterns: ['node_modules/'],
      transform: {
        '^.+\\.ts$': [
          'ts-jest',
          {
            tsconfig: '<rootDir>/tsconfig.json',
          },
        ],
      },
      moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json'],
    },
  ],
  coverageProvider: 'v8',
};

// ESM export because project is TS/Next with "type": "module"
// `next/jest` has a narrower type than we need (projects list),
// cast to `any` to avoid TS complaint while still returning a valid config.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default createJestConfig(config as any);
