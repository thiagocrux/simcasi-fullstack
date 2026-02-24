import { MailProvider } from '@/core/domain/providers/mail.provider';
import { logger } from '@/lib/logger.utils';

/**
 * A mock implementation of MailProvider that logs the email instead of sending it.
 * Useful for development/testing or when no email provider is configured yet.
 */
export class NullMailProvider implements MailProvider {
  /**
   * Logs the email content instead of sending it.
   * @param data Email details.
   */
  async send(data: {
    to: string;
    subject: string;
    body: string;
    template?: string;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    params?: Record<string, any>;
  }): Promise<void> {
    logger.info('Mock email sent', {
      to: data.to,
      subject: data.subject,
      body: data.body,
      template: data.template,
      params: data.params,
      action: 'send_email_mock',
    });
  }
}
