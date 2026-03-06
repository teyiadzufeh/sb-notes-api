export default {
  preset: 'ts-jest',
  testEnvironment: 'node',
  testMatch: ['**/__tests__/**/*.test.ts'],
  clearMocks: true,
  setupFiles: ['dotenv/config'],
  globals: {
    'ts-jest': {
      tsconfig: { strict: true }
    }
  }
};