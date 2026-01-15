import { NotFoundError } from '@/core/domain/errors/app.error';
import { AuditLogRepository } from '@/core/domain/repositories/audit-log.repository';
import { SessionRepository } from '@/core/domain/repositories/session.repository';
import { UserRepository } from '@/core/domain/repositories/user.repository';
import {
  DeleteUserInput,
  DeleteUserOutput,
} from '../../contracts/user/delete-user.contract';
import { UseCase } from '../use-case.interface';

/**
 * Use case to soft delete a user and revoke all their sessions.
 */
export class DeleteUserUseCase implements UseCase<
  DeleteUserInput,
  DeleteUserOutput
> {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly sessionRepository: SessionRepository,
    private readonly auditLogRepository: AuditLogRepository
  ) {}

  async execute(input: DeleteUserInput): Promise<DeleteUserOutput> {
    const { id, deletedBy, ipAddress, userAgent } = input;

    // 1. Check if the user exists.
    const user = await this.userRepository.findById(id);

    if (!user) {
      throw new NotFoundError('User not found');
    }

    // 2. Soft delete the user.
    await this.userRepository.softDelete(id);

    // 3. Revoke all active sessions (force logout everywhere).
    await this.sessionRepository.revokeAllByUserId(id);

    // 4. Create audit log.
    const { password: _, ...oldValuesWithoutPassword } = user;

    await this.auditLogRepository.create({
      userId: deletedBy || 'SYSTEM',
      action: 'DELETE',
      entityName: 'USER',
      entityId: id,
      oldValues: oldValuesWithoutPassword,
      ipAddress,
      userAgent,
    });
  }
}
