const mockSignJWT = {
  setProtectedHeader: jest.fn().mockReturnThis(),
  setIssuedAt: jest.fn().mockReturnThis(),
  setExpirationTime: jest.fn().mockReturnThis(),
  sign: jest.fn().mockResolvedValue('header.payload.signature'),
};

jest.mock('jose', () => ({
  SignJWT: jest.fn(() => mockSignJWT),
  jwtVerify: jest.fn(),
}));

jest.mock('../lib/env.config', () => ({
  env: {
    JWT_SECRET: 'test-secret-key-minimum-32-chars!!',
    JWT_ACCESS_TOKEN_EXPIRATION: '15m',
    JWT_REFRESH_TOKEN_EXPIRATION: '7d',
    BCRYPT_ROUNDS: '10',
  },
}));

jest.mock('bcryptjs', () => ({
  hash: jest.fn().mockResolvedValue('hashed-password'),
  compare: jest.fn().mockResolvedValue(true),
}));

import { makeHashProvider, makeTokenProvider } from './security.factory';

describe('security.factory', () => {
  describe('makeTokenProvider', () => {
    it('should return a token provider instance', () => {
      const provider = makeTokenProvider();
      expect(provider).toBeDefined();
    });

    it('should return a singleton (same instance every time)', () => {
      const provider1 = makeTokenProvider();
      const provider2 = makeTokenProvider();
      expect(provider1).toBe(provider2);
    });
  });

  describe('makeHashProvider', () => {
    it('should return a hash provider instance', () => {
      const provider = makeHashProvider();
      expect(provider).toBeDefined();
    });

    it('should return a singleton (same instance every time)', () => {
      const provider1 = makeHashProvider();
      const provider2 = makeHashProvider();
      expect(provider1).toBe(provider2);
    });
  });
});
