import { MailProvider } from '@/core/domain/providers/mail.provider';
import { env } from '../lib/env.config';
import { NullMailProvider } from '../providers/mail.null.provider';
import { ResendMailProvider } from '../providers/mail.resend.provider';

/**
 * Singleton for the mail provider to manage SMTP connections or API instances.
 */
let mailProvider: MailProvider;

/**
 * Factory for MailProvider (Email notifications).
 * Returns ResendMailProvider if an API key is configured, otherwise fallback to NullMailProvider.
 * @return A singleton instance of the mail provider.
 */
export function makeMailProvider(): MailProvider {
  if (mailProvider) return mailProvider;

  const apiKey = env.RESEND_API_KEY;
  const from = env.MAIL_FROM || 'no-reply@onboarding.resend.dev';

  if (apiKey && apiKey.startsWith('re_')) {
    mailProvider = new ResendMailProvider(apiKey, from);
  } else {
    mailProvider = new NullMailProvider();
  }

  return mailProvider;
}
