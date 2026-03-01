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
  },
}));

import { jwtVerify } from 'jose';
import { JoseTokenProvider } from './token.jose.provider';

const mockJwtVerify = jwtVerify as jest.Mock;

describe('JoseTokenProvider', () => {
  let provider: JoseTokenProvider;

  beforeEach(() => {
    jest.clearAllMocks();
    provider = new JoseTokenProvider();
  });

  describe('generateAccessToken', () => {
    it('should generate a JWT access token string', async () => {
      const token = await provider.generateAccessToken({
        sub: 'user-1',
        roleId: 'role-1',
      });

      expect(typeof token).toBe('string');
      expect(mockSignJWT.setProtectedHeader).toHaveBeenCalledWith({
        alg: 'HS256',
      });
      expect(mockSignJWT.sign).toHaveBeenCalled();
    });
  });

  describe('generateRefreshToken', () => {
    it('should generate a JWT refresh token string', async () => {
      const token = await provider.generateRefreshToken({
        sub: 'user-1',
        sid: 'session-1',
      });

      expect(typeof token).toBe('string');
      expect(mockSignJWT.sign).toHaveBeenCalled();
    });
  });

  describe('verifyToken', () => {
    it('should verify and return the payload of a valid token', async () => {
      const payload = { sub: 'user-1', roleId: 'role-1' };
      mockJwtVerify.mockResolvedValueOnce({ payload });

      const result = await provider.verifyToken<typeof payload>('valid-token');

      expect(result).toEqual(payload);
    });

    it('should return null for a malformed token', async () => {
      mockJwtVerify.mockRejectedValueOnce(new Error('Invalid token'));

      const result = await provider.verifyToken('invalid.token.string');

      expect(result).toBeNull();
    });

    it('should return null for a token with a tampered signature', async () => {
      mockJwtVerify.mockRejectedValueOnce(
        new Error('signature verification failed')
      );

      const result = await provider.verifyToken('tampered');

      expect(result).toBeNull();
    });
  });

  describe('getRefreshExpiryDate', () => {
    it('should return a future Date when using days suffix', () => {
      const date = provider.getRefreshExpiryDate();
      expect(date.getTime()).toBeGreaterThan(Date.now());
    });
  });

  describe('getRefreshExpirationInSeconds', () => {
    it('should return 604800 seconds for 7d', () => {
      expect(provider.getRefreshExpirationInSeconds()).toBe(7 * 24 * 60 * 60);
    });
  });

  describe('getAccessExpirationInSeconds', () => {
    it('should return 900 seconds for 15m', () => {
      expect(provider.getAccessExpirationInSeconds()).toBe(15 * 60);
    });
  });
});
