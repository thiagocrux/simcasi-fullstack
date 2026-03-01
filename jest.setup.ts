// Import testing library matchers only for DOM-based tests
try {
  import('@testing-library/jest-dom');
} catch (e) {
  // Silently skip if not supported in this environment
}

/**
 * Mock jose at the earliest point to prevent ESM parsing errors
 * in Node.js test environments (e.g., actions tests)
 */
jest.mock(
  'jose',
  () => ({
    SignJWT: class {
      setProtectedHeader() {
        return this;
      }
      addAudience() {
        return this;
      }
      addSubject() {
        return this;
      }
      addClaim() {
        return this;
      }
      setIssuedAt() {
        return this;
      }
      setExpirationTime() {
        return this;
      }
      sign() {
        return Promise.resolve('mock-token');
      }
    },
    jwtVerify: jest.fn().mockResolvedValue({
      payload: { userId: '550e8400-e29b-41d4-a716-446655440000' },
    }),
    errors: {},
  }),
  { virtual: true }
);

/**
 * Mock the actual security provider to avoid loading real jose
 */
jest.mock(
  '<rootDir>/core/infrastructure/providers/token.jose.provider',
  () => ({
    JoseTokenProvider: class {
      async sign() {
        return 'mock-token';
      }
      async verify() {
        return { userId: '550e8400-e29b-41d4-a716-446655440000' };
      }
      getAccessExpirationInSeconds() {
        return 3600;
      }
      getRefreshExpirationInSeconds() {
        return 604800;
      }
    },
  }),
  { virtual: true }
);

beforeEach(() => {
  jest.clearAllMocks();
});
