jest.mock('bcryptjs', () => ({
  hash: jest.fn(),
  compare: jest.fn(),
}));

import { compare, hash } from 'bcryptjs';
import { BcryptHashProvider } from './hash.bcrypt.provider';

describe('BcryptHashProvider', () => {
  let provider: BcryptHashProvider;

  beforeEach(() => {
    jest.clearAllMocks();
    provider = new BcryptHashProvider();
  });

  describe('hash', () => {
    it('should hash a plain text string using bcrypt', async () => {
      (hash as jest.Mock).mockResolvedValueOnce('hashed-password');

      const result = await provider.hash('my-password');

      expect(hash).toHaveBeenCalledWith('my-password', 12);
      expect(result).toBe('hashed-password');
    });

    it('should propagate errors from bcrypt hash', async () => {
      (hash as jest.Mock).mockRejectedValueOnce(new Error('Hash failed'));

      await expect(provider.hash('my-password')).rejects.toThrow('Hash failed');
    });
  });

  describe('compare', () => {
    it('should return true when payload matches hash', async () => {
      (compare as jest.Mock).mockResolvedValueOnce(true);

      const result = await provider.compare('my-password', 'hashed-password');

      expect(compare).toHaveBeenCalledWith('my-password', 'hashed-password');
      expect(result).toBe(true);
    });

    it('should return false when payload does not match hash', async () => {
      (compare as jest.Mock).mockResolvedValueOnce(false);

      const result = await provider.compare(
        'wrong-password',
        'hashed-password'
      );

      expect(result).toBe(false);
    });

    it('should propagate errors from bcrypt compare', async () => {
      (compare as jest.Mock).mockRejectedValueOnce(new Error('Compare failed'));

      await expect(
        provider.compare('my-password', 'hashed-password')
      ).rejects.toThrow('Compare failed');
    });
  });
});
