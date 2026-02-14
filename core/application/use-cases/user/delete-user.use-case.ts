import { NotFoundError } from '@/core/domain/errors/app.error';
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
   * @param input The ID of the user to delete and audit info.
   * @return A promise that resolves to the deleted user info.
   * @throws {NotFoundError} If the user is not found.
   */
  async execute(input: DeleteUserInput): Promise<DeleteUserOutput> {
    const { id } = input;
    const { userId: executorId, ipAddress, userAgent } = getRequestContext();

    // 1. Check if the user exists.
    const user = await this.userRepository.findById(id);

    if (!user) {
      throw new NotFoundError('Usuário');
    }

    // 2. Soft delete the user.
    await this.userRepository.softDelete(id, executorId);

    // 3. Revoke all active sessions (force logout everywhere).
    await this.sessionRepository.revokeAllByUserId(id);

    // 4. Create audit log.
    const { password: _, ...oldValuesWithoutPassword } = user;

    await this.auditLogRepository.create({
      userId: executorId,
      action: 'DELETE',
      entityName: 'USER',
      entityId: id,
      oldValues: oldValuesWithoutPassword,
      ipAddress,
      userAgent,
    });
  }
}
