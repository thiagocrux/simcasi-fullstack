import { MailProvider } from '@/core/domain/providers/mail.provider';
import { AuditLogRepository } from '@/core/domain/repositories/audit-log.repository';
import { PasswordResetTokenRepository } from '@/core/domain/repositories/password-reset-token.repository';
import { UserRepository } from '@/core/domain/repositories/user.repository';
import { getRequestContext } from '@/core/infrastructure/lib/request-context';
import { randomUUID } from 'node:crypto';
import {
  RequestPasswordResetInput,
  RequestPasswordResetOutput,
} from '../../contracts/user/request-password-reset.contract';
import { UseCase } from '../use-case.interface';

/**
 * Use case to request a password reset email.
 * This is a public operation that identifies the user and initiates a token-based flow.
 */
export class RequestPasswordResetUseCase implements UseCase<
  RequestPasswordResetInput,
  RequestPasswordResetOutput
> {
  /**
   * Creates an instance of RequestPasswordResetUseCase.
   * @param userRepository Repository for user data.
   * @param resetTokenRepository Repository for token management.
   * @param auditLogRepository Repository for audit logging.
   * @param mailProvider Provider for sending emails.
   */
  constructor(
    private readonly userRepository: UserRepository,
    private readonly resetTokenRepository: PasswordResetTokenRepository,
    private readonly auditLogRepository: AuditLogRepository,
    private readonly mailProvider: MailProvider
  ) {}

  /**
   * Executes the forgot password request.
   * For security, it always returns a generic success message even if the email doesn't exist.
   *
   * @param input Data for the request (email).
   * @return Success message.
   */
  async execute(
    input: RequestPasswordResetInput
  ): Promise<RequestPasswordResetOutput> {
    // 1. Get request metadata for auditing.
    const { ipAddress, userAgent } = getRequestContext();
    const { email } = input;

    // 2. Locate user by email (only if active).
    const user = await this.userRepository.findByEmail(email);

    // 3. Security: Always return "email sent" (or similar) to prevent user enumeration.
    if (!user) {
      return {
        message:
          'Se o e-mail estiver registrado, você receberá instruções de recuperação em breve.',
      };
    }

    // 4. Invalidate any existing tokens for this user.
    await this.resetTokenRepository.invalidateAllForUser(user.id);

    // 5. Generate a new secure token and set expiration (e.g., 1 hour).
    const token = randomUUID();
    const expiresAt = new Date();
    expiresAt.setHours(expiresAt.getHours() + 1);

    // 6. Record the token in persistence.
    await this.resetTokenRepository.create({
      userId: user.id,
      token,
      expiresAt,
    });

    // 7. Audit log (PASSWORD_RESET_REQUESTED action).
    await this.auditLogRepository.create({
      action: 'PASSWORD_RESET_REQUEST',
      entityName: 'USER',
      entityId: user.id,
      userId: user.id, // User is requesting for themselves.
      oldValues: { RequestPasswordResetRequested: false },
      newValues: { RequestPasswordResetRequested: true },
      ipAddress,
      userAgent,
    });

    // 8. Send recovery email.
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
    const resetLink = `${baseUrl}/auth/password-recovery?token=${token}`;

    await this.mailProvider.send({
      to: email,
      subject: 'Recuperação de Senha - SIMCASI',
      body: `
        <div style="font-family: sans-serif; line-height: 1.5;">
          <p>Olá <strong>${user.name}</strong>,</p>
          <p>Recebemos uma solicitação para redefinir a senha da sua conta no SIMCASI.</p>
          <p>Clique no link abaixo para criar uma nova senha:</p>
          <p>
            <a href="${resetLink}" target="_blank" style="color: #2563eb; font-weight: bold; text-decoration: underline;">
              Redefinir minha senha agora
            </a>
          </p>
          <p style="font-size: 0.875rem; color: #6b7280;">
            Este link é válido por 1 hora. Se você não solicitou isso, por favor ignore este e-mail.
          </p>
        </div>
      `,
    });

    return {
      message:
        'Se o e-mail estiver registrado, você receberá instruções de recuperação em breve.',
    };
  }
}
