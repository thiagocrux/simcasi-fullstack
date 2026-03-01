jest.mock('@/lib/logger.utils', () => ({
  logger: { info: jest.fn(), error: jest.fn(), warn: jest.fn() },
}));

import { logger } from '@/lib/logger.utils';
import { NullMailProvider } from './mail.null.provider';

describe('NullMailProvider', () => {
  let provider: NullMailProvider;

  beforeEach(() => {
    jest.clearAllMocks();
    provider = new NullMailProvider();
  });

  it('should log the email instead of sending it', async () => {
    const emailData = {
      to: 'user@example.com',
      subject: 'Test Subject',
      body: 'Test body content',
    };

    await provider.send(emailData);

    expect(logger.info).toHaveBeenCalledWith(
      'Mock email sent',
      expect.objectContaining({
        to: emailData.to,
        subject: emailData.subject,
        body: emailData.body,
        action: 'send_email_mock',
      })
    );
  });

  it('should log template and params when provided', async () => {
    const emailData = {
      to: 'user@example.com',
      subject: 'Reset Password',
      body: '<p>Reset link</p>',
      template: 'reset-password',
      params: { token: 'abc123' },
    };

    await provider.send(emailData);

    expect(logger.info).toHaveBeenCalledWith(
      'Mock email sent',
      expect.objectContaining({
        template: 'reset-password',
        params: { token: 'abc123' },
      })
    );
  });
});
