import { USER_CONSTANTS } from '@/core/domain/constants/user.constants';
import { ForbiddenError, NotFoundError } from '@/core/domain/errors/app.error';
import { AuditLogRepository } from '@/core/domain/repositories/audit-log.repository';
import { SessionRepository } from '@/core/domain/repositories/session.repository';
import { UserRepository } from '@/core/domain/repositories/user.repository';
import { getRequestContext } from '@/core/infrastructure/lib/request-context';
import {
  DeleteUserInput,
  DeleteUserOutput,
} from '../../contracts/user/delete-user.contract';
import { UseCase } from '../use-case.interface';

/**
 * Use case to soft delete an user and revoke all their sessions.
 */
export class DeleteUserUseCase implements UseCase<
  DeleteUserInput,
  DeleteUserOutput
> {
  /**
   * Creates an instance of DeleteUserUseCase.
   * @param userRepository The repository for user data operations.
   * @param sessionRepository The repository for session data operations.
   * @param auditLogRepository The repository for audit logging.
   */
  constructor(
    private readonly userRepository: UserRepository,
    private readonly sessionRepository: SessionRepository,
    private readonly auditLogRepository: AuditLogRepository
  ) {}

  /**
   * Executes the use case to soft delete a user.
   * @param input The ID of the user to delete.
   * @return A promise that resolves to the deleted user info.
   * @throws {NotFoundError} If the user is not found.
   */
  async execute(input: DeleteUserInput): Promise<DeleteUserOutput> {
    const { id } = input;
    const { userId: executorId, ipAddress, userAgent } = getRequestContext();

    // 1. Check if the user exists.
    const existingUser = await this.userRepository.findById(id);

    if (!existingUser) {
      throw new NotFoundError('Usuário');
    }

    // 2. Prevent deletion of protected system users.
    if (
      existingUser.isSystem ||
      existingUser.email === USER_CONSTANTS.SYSTEM_ADMIN_EMAIL ||
      existingUser.email === process.env.PRISMA_SEED_EMAIL
    ) {
      throw new ForbiddenError(
        'Este usuário é protegido pelo sistema e não pode ser excluído.'
      );
    }

    // 3. Soft delete the user.
    await this.userRepository.softDelete(id, executorId);

    // 4. Revoke all active sessions (force logout everywhere).
    await this.sessionRepository.revokeAllByUserId(id);

    // 5. Create audit log.
    const { password: _, ...oldValuesWithoutPassword } = existingUser;

    await this.auditLogRepository.create({
      userId: executorId,
      action: 'DELETE',
      entityName: 'USER',
      entityId: id,
      oldValues: JSON.parse(JSON.stringify(oldValuesWithoutPassword)),
      ipAddress,
      userAgent,
    });
  }
}
