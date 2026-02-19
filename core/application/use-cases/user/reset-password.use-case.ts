import { NotFoundError, ValidationError } from '@/core/domain/errors/app.error';
import { HashProvider } from '@/core/domain/providers/hash.provider';
import { AuditLogRepository } from '@/core/domain/repositories/audit-log.repository';
import { PasswordResetTokenRepository } from '@/core/domain/repositories/password-reset-token.repository';
import { UserRepository } from '@/core/domain/repositories/user.repository';
import { getRequestContext } from '@/core/infrastructure/lib/request-context';
import {
  ResetPasswordInput,
  ResetPasswordOutput,
} from '../../contracts/user/reset-password.contract';
import { UseCase } from '../use-case.interface';

/**
 * Use case to reset a user's password using a valid recovery token.
 */
export class ResetPasswordUseCase implements UseCase<
  ResetPasswordInput,
  ResetPasswordOutput
> {
  /**
   * Creates an instance of ResetPasswordUseCase.
   * @param userRepository Repository for user data.
   * @param tokenRepository Repository for token management.
   * @param hashProvider Provider for password hashing.
   * @param auditLogRepository Repository for audit logging.
   */
  constructor(
    private readonly userRepository: UserRepository,
    private readonly tokenRepository: PasswordResetTokenRepository,
    private readonly hashProvider: HashProvider,
    private readonly auditLogRepository: AuditLogRepository
  ) {}

  /**
   * Executes the password reset flow.
   * @param input Reset data (token and new password).
   * @return The updated user record.
   */
  async execute(input: ResetPasswordInput): Promise<ResetPasswordOutput> {
    const { ipAddress, userAgent } = getRequestContext();
    const { token, newPassword } = input;

    // 1. Locate and validate the token.
    const tokenRecord = await this.tokenRepository.findByToken(token);
    if (!tokenRecord) {
      throw new ValidationError(
        'O link de recuperação de senha é inválido ou expirou.'
      );
    }

    // 2. Locate the associated user account.
    const user = await this.userRepository.findById(tokenRecord.userId);
    if (!user) {
      throw new NotFoundError('Usuário');
    }

    // 3. Optional: Verify new password isn't the same as old one.
    if (user.password) {
      const isSamePassword = await this.hashProvider.compare(
        newPassword,
        user.password
      );
      if (isSamePassword) {
        throw new ValidationError(
          'A nova senha não pode ser igual à anterior.'
        );
      }
    }

    // 4. Update password with hash.
    const hashedPassword = await this.hashProvider.hash(newPassword);
    const updatedUser = await this.userRepository.updatePassword(
      user.id,
      hashedPassword,
      user.id // Self-update by recovery
    );

    // 5. Mark the recovery token as consumed.
    await this.tokenRepository.markAsUsed(tokenRecord.id);

    // 6. Record the security event in audit log.
    await this.auditLogRepository.create({
      action: 'PASSWORD_RESET',
      entityName: 'USER',
      entityId: user.id,
      userId: user.id,
      oldValues: { password: '[PROTECTED]' },
      newValues: { password: '[PROTECTED]' },
      ipAddress,
      userAgent,
    });

    // 7. Return user details without password.
    const { password, ...userWithoutPassword } = updatedUser;
    return userWithoutPassword;
  }
}
