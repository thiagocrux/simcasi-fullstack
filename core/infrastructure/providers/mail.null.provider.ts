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
    logger.info(`[MAIL_MOCK] Sending email to ${data.to}`);
    logger.info(`[MAIL_MOCK] Subject: ${data.subject}`);
    logger.info(`[MAIL_MOCK] Body: ${data.body}`);
    if (data.template) {
      logger.info(`[MAIL_MOCK] Template: ${data.template}`);
      logger.info(`[MAIL_MOCK] Params: ${JSON.stringify(data.params)}`);
    }
  }
}
