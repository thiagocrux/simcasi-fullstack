import { Resend } from 'resend';

import { MailProvider } from '@/core/domain/providers/mail.provider';
import { logger } from '@/lib/logger.utils';

/**
 * Infrastructure implementation of MailProvider using Resend API.
 * Handles transactional emails with support for HTML and plain text.
 */
export class ResendMailProvider implements MailProvider {
  private readonly resend: Resend;
  private readonly from: string;

  constructor(apiKey: string, from: string) {
    this.resend = new Resend(apiKey);
    this.from = from;
  }

  /**
   * Sends an email via Resend API.
   * If the body contains HTML tags, it's sent as HTML; otherwise, it's sent as plain text.
   * @param data Email details including recipient, subject, and content.
   */
  async send(data: {
    to: string;
    subject: string;
    body: string;
    template?: string;
    params?: Record<string, unknown>;
  }): Promise<void> {
    try {
      const isHtml = /<[a-z][\s\S]*>/i.test(data.body);

      const emailOptions = {
        from: this.from,
        to: [data.to],
        subject: data.subject,
        ...(isHtml ? { html: data.body } : { text: data.body }),
      };

      const { data: response, error } =
        await this.resend.emails.send(emailOptions);

      if (error) {
        throw new Error(error.message);
      }

      logger.info('Email sent successfully via Resend', {
        to: data.to,
        id: response?.id,
        action: 'send_email_resend',
      });
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      logger.error('Failed to send email via Resend', {
        to: data.to,
        error: error.message,
        action: 'send_email_resend',
      });

      //NOTE: We don't throw here to prevent the whole use case from failing due to an email notification error.
    }
  }
}
