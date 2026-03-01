jest.mock('../providers/mail.null.provider');
jest.mock('../providers/mail.resend.provider');
jest.mock('../lib/env.config', () => ({
  env: {
    RESEND_API_KEY: '',
    MAIL_FROM: 'test@example.com',
  },
}));

import { makeMailProvider } from './mail.factory';

describe('mail.factory', () => {
  describe('makeMailProvider', () => {
    it('should return a MailProvider instance', () => {
      const provider = makeMailProvider();
      expect(provider).toBeDefined();
      expect(provider).toHaveProperty('send');
    });

    it('should return a singleton (same instance every time)', () => {
      const provider1 = makeMailProvider();
      const provider2 = makeMailProvider();
      expect(provider1).toBe(provider2);
    });

    it('should have send method', () => {
      const provider = makeMailProvider();
      expect(provider.send).toBeDefined();
      expect(typeof provider.send).toBe('function');
    });
  });
});
