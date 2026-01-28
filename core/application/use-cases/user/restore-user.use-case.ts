import { SYSTEM_CONSTANTS } from '@/core/domain/constants/system.constants';
import { User } from '@/core/domain/entities/user.entity';
import { NotFoundError } from '@/core/domain/errors/app.error';
import { AuditLogRepository } from '@/core/domain/repositories/audit-log.repository';
import { UserRepository } from '@/core/domain/repositories/user.repository';
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
  constructor(
    private readonly userRepository: UserRepository,
    private readonly auditLogRepository: AuditLogRepository
  ) {}

  async execute(input: RestoreUserInput): Promise<RestoreUserOutput> {
    const { id, userId, ipAddress, userAgent } = input;

    // 1. Check if the user exists (including deleted).
    const user = await this.userRepository.findById(id, true);

    if (!user) {
      throw new NotFoundError('User not found');
    }

    // 2. Perform the restoration if it was deleted.
    if (user.deletedAt) {
      await this.userRepository.restore(
        id,
        userId ?? SYSTEM_CONSTANTS.DEFAULT_SYSTEM_USER_ID
      );
      user.deletedAt = null;
      user.updatedBy = userId ?? SYSTEM_CONSTANTS.DEFAULT_SYSTEM_USER_ID;

      // 3. Create audit log.
      const { password: _, ...newValuesWithoutPassword } = user;

      await this.auditLogRepository.create({
        userId: userId ?? SYSTEM_CONSTANTS.DEFAULT_SYSTEM_USER_ID,
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
