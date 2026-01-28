import { SYSTEM_CONSTANTS } from '@/core/domain/constants/system.constants';
import { NotFoundError } from '@/core/domain/errors/app.error';
import { AuditLogRepository } from '@/core/domain/repositories/audit-log.repository';
import { RoleRepository } from '@/core/domain/repositories/role.repository';
import {
  DeleteRoleInput,
  DeleteRoleOutput,
} from '../../contracts/role/delete-role.contract';
import { UseCase } from '../use-case.interface';

/**
 * Use case to soft delete a role.
 */
export class DeleteRoleUseCase implements UseCase<
  DeleteRoleInput,
  DeleteRoleOutput
> {
  constructor(
    private readonly roleRepository: RoleRepository,
    private readonly auditLogRepository: AuditLogRepository
  ) {}

  async execute(input: DeleteRoleInput): Promise<DeleteRoleOutput> {
    const { id, userId, ipAddress, userAgent } = input;

    // 1. Check if the role exists.
    const existing = await this.roleRepository.findById(id);
    if (!existing) {
      throw new NotFoundError('Role not found');
    }

    // 2. Soft delete the role.
    await this.roleRepository.softDelete(id);

    // 3. Create audit log.
    await this.auditLogRepository.create({
      userId: userId ?? SYSTEM_CONSTANTS.DEFAULT_SYSTEM_USER_ID,
      action: 'DELETE',
      entityName: 'ROLE',
      entityId: id,
      oldValues: existing,
      ipAddress,
      userAgent,
    });
  }
}
