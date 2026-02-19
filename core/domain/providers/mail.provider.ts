/**
 * Contract for email notification services.
 * Allows sending transactional emails, alerts, and system notifications.
 */
export interface MailProvider {
  /**
   * Sends an email with the specified options.
   * @param data Details of the email to send (recipient, subject, body, variables, etc.)
   */
  send(data: {
    to: string;
    subject: string;
    body: string;
    template?: string;
    params?: Record<string, unknown>;
  }): Promise<void>;
}
