import {
  ForbiddenError,
  NotFoundError,
  ValidationError,
} from '@/core/domain/errors/app.error';
import { HashProvider } from '@/core/domain/providers/hash.provider';
import { AuditLogRepository } from '@/core/domain/repositories/audit-log.repository';
import { UserRepository } from '@/core/domain/repositories/user.repository';
import { getRequestContext } from '@/core/infrastructure/lib/request-context';
import {
  ChangePasswordInput,
  ChangePasswordOutput,
} from '../../contracts/user/change-password.contract';
import { UseCase } from '../use-case.interface';

/**
 * Use case to change a user's password.
 * Includes current password validation, hashing, and audit logging.
 */
export class ChangePasswordUseCase implements UseCase<
  ChangePasswordInput,
  ChangePasswordOutput
> {
  /**
   * Creates an instance of ChangePasswordUseCase.
   * @param userRepository The repository for user data operations.
   * @param hashProvider The provider for password hashing.
   * @param auditLogRepository The repository for audit logging.
   */
  constructor(
    private readonly userRepository: UserRepository,
    private readonly hashProvider: HashProvider,
    private readonly auditLogRepository: AuditLogRepository
  ) {}

  /**
   * Executes the password change logic.
   * @param input The password change data.
   * @returns The user record without the password field.
   */
  async execute(input: ChangePasswordInput): Promise<ChangePasswordOutput> {
    const { userId: executorId, ipAddress, userAgent } = getRequestContext();
    const { userId, currentPassword, newPassword } = input;

    // 1. Check if the user exists.
    const user = await this.userRepository.findById(userId);
    if (!user) {
      throw new NotFoundError('Usuário');
    }

    // 2. Authorization: Only the user themselves can change their own password.
    if (userId !== executorId) {
      throw new ForbiddenError('Usuário pode alterar somente a própria senha.');
    }

    // 3. Verify current password.
    if (!user.password) {
      throw new ValidationError('Usuário sem senha definida.');
    }

    const isCurrentPasswordCorrect = await this.hashProvider.compare(
      currentPassword,
      user.password
    );

    if (!isCurrentPasswordCorrect) {
      throw new ValidationError('A senha atual está incorreta.');
    }

    // 4. Check if the new password is the same as the current one.
    const isSamePassword = await this.hashProvider.compare(
      newPassword,
      user.password
    );

    if (isSamePassword) {
      throw new ValidationError(
        'A nova senha não pode ser igual à senha atual.'
      );
    }

    // 5. Hash the new password.
    const hashedNewPassword = await this.hashProvider.hash(newPassword);

    // 6. Persist the change.
    const updatedUser = await this.userRepository.updatePassword(
      userId,
      hashedNewPassword,
      executorId
    );

    // 7. Register audit log.
    await this.auditLogRepository.create({
      action: 'UPDATE',
      entityName: 'USER',
      entityId: userId,
      userId: executorId,
      oldValues: { password: '[PROTECTED]' },
      newValues: { password: '[PROTECTED]' },
      ipAddress,
      userAgent,
    });

    const { password, ...userWithoutPassword } = updatedUser;
    return userWithoutPassword;
  }
}
