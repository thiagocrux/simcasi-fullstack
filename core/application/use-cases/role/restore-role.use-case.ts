import { NotFoundError } from '@/core/domain/errors/app.error';
import { AuditLogRepository } from '@/core/domain/repositories/audit-log.repository';
import { RoleRepository } from '@/core/domain/repositories/role.repository';
import {
  RestoreRoleInput,
  RestoreRoleOutput,
} from '../../contracts/role/restore-role.contract';
import { UseCase } from '../use-case.interface';

/**
 * Use case to restore a soft-deleted role.
 */
export class RestoreRoleUseCase implements UseCase<
  RestoreRoleInput,
  RestoreRoleOutput
> {
  constructor(
    private readonly roleRepository: RoleRepository,
    private readonly auditLogRepository: AuditLogRepository
  ) {}

  async execute(input: RestoreRoleInput): Promise<RestoreRoleOutput> {
    const { id, restoredBy, ipAddress, userAgent } = input;

    // 1. Check if the role exists (including deleted).
    const role = await this.roleRepository.findById(id, true);
    if (!role) {
      throw new NotFoundError('Role not found');
    }

    // 2. Perform the restoration if it was deleted.
    if (role.deletedAt) {
      await this.roleRepository.restore(id);
    }

    const restoredRole = (await this.roleRepository.findById(
      id
    )) as RestoreRoleOutput;

    // 3. Create audit log.
    await this.auditLogRepository.create({
      userId: restoredBy || 'SYSTEM',
      action: 'RESTORE',
      entityName: 'ROLE',
      entityId: id,
      newValues: restoredRole,
      ipAddress,
      userAgent,
    });

    return restoredRole;
  }
}
