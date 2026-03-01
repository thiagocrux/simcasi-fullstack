const mockSend = jest.fn();

jest.mock('resend', () => ({
  Resend: jest.fn().mockImplementation(() => ({
    emails: { send: mockSend },
  })),
}));

jest.mock('@/lib/logger.utils', () => ({
  logger: { info: jest.fn(), error: jest.fn(), warn: jest.fn() },
}));

import { logger } from '@/lib/logger.utils';
import { ResendMailProvider } from './mail.resend.provider';

describe('ResendMailProvider', () => {
  let provider: ResendMailProvider;

  beforeEach(() => {
    jest.clearAllMocks();
    provider = new ResendMailProvider('test-api-key', 'noreply@example.com');
  });

  it('should send a plain text email successfully', async () => {
    mockSend.mockResolvedValueOnce({
      data: { id: 'email-id-123' },
      error: null,
    });

    await provider.send({
      to: 'user@example.com',
      subject: 'Test',
      body: 'Plain text content',
    });

    expect(mockSend).toHaveBeenCalledWith(
      expect.objectContaining({
        from: 'noreply@example.com',
        to: ['user@example.com'],
        subject: 'Test',
        text: 'Plain text content',
      })
    );
    expect(logger.info).toHaveBeenCalledWith(
      'Email sent successfully via Resend',
      expect.objectContaining({ to: 'user@example.com', id: 'email-id-123' })
    );
  });

  it('should send an HTML email when body contains HTML tags', async () => {
    mockSend.mockResolvedValueOnce({
      data: { id: 'email-id-456' },
      error: null,
    });

    await provider.send({
      to: 'user@example.com',
      subject: 'HTML Test',
      body: '<p>Hello</p>',
    });

    expect(mockSend).toHaveBeenCalledWith(
      expect.objectContaining({
        html: '<p>Hello</p>',
      })
    );
  });

  it('should log error when Resend API returns an error object', async () => {
    mockSend.mockResolvedValueOnce({
      data: null,
      error: { message: 'API key invalid' },
    });

    await provider.send({
      to: 'user@example.com',
      subject: 'Test',
      body: 'Body',
    });

    expect(logger.error).toHaveBeenCalledWith(
      'Failed to send email via Resend',
      expect.objectContaining({
        to: 'user@example.com',
        error: 'API key invalid',
      })
    );
  });

  it('should log error when send throws an exception', async () => {
    mockSend.mockRejectedValueOnce(new Error('Network error'));

    await provider.send({
      to: 'user@example.com',
      subject: 'Test',
      body: 'Body',
    });

    expect(logger.error).toHaveBeenCalledWith(
      'Failed to send email via Resend',
      expect.objectContaining({
        error: 'Network error',
      })
    );
  });

  it('should not throw even when sending fails', async () => {
    mockSend.mockRejectedValueOnce(new Error('Fatal'));

    await expect(
      provider.send({ to: 'a@b.com', subject: 's', body: 'b' })
    ).resolves.toBeUndefined();
  });
});
