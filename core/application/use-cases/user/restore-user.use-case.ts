import { User } from '@/core/domain/entities/user.entity';
import { NotFoundError } from '@/core/domain/errors/app.error';
import { AuditLogRepository } from '@/core/domain/repositories/audit-log.repository';
import { UserRepository } from '@/core/domain/repositories/user.repository';
import { getRequestContext } from '@/core/infrastructure/lib/request-context';
import {
  RestoreUserInput,
  RestoreUserOutput,
} from '../../contracts/user/restore-user.contract';
import { UseCase } from '../use-case.interface';

/**
 * Use case to restore a soft-deleted user.
 */
export class RestoreUserUseCase implements UseCase<
  RestoreUserInput,
  RestoreUserOutput
> {
  /**
   * Creates an instance of RestoreUserUseCase.
   * @param userRepository The repository for user data operations.
   * @param auditLogRepository The repository for audit logging.
   */
  constructor(
    private readonly userRepository: UserRepository,
    private readonly auditLogRepository: AuditLogRepository
  ) {}

  /**
   * Executes the use case to restore a soft-deleted user.
   * @param input The ID of the user to restore and audit info.
   * @return A promise that resolves to the restored user.
   * @throws {NotFoundError} If the user is not found.
   */
  async execute(input: RestoreUserInput): Promise<RestoreUserOutput> {
    const { id } = input;
    const { userId: executorId, ipAddress, userAgent } = getRequestContext();

    // 1. Check if the user exists (including deleted).
    const user = await this.userRepository.findById(id, true);

    if (!user) {
      throw new NotFoundError('User not found');
    }

    // 2. Perform the restoration if it was deleted.
    if (user.deletedAt) {
      await this.userRepository.restore(id, executorId);
      user.deletedAt = null;
      user.updatedBy = executorId;

      // 3. Create audit log.
      const { password: _, ...newValuesWithoutPassword } = user;

      await this.auditLogRepository.create({
        userId: executorId,
        action: 'RESTORE',
        entityName: 'USER',
        entityId: id,
        newValues: newValuesWithoutPassword,
        ipAddress,
        userAgent,
      });
    }

    delete (user as User).password;

    return user as RestoreUserOutput;
  }
}
