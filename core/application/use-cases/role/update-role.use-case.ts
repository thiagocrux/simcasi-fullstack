import { ConflictError, NotFoundError } from '@/core/domain/errors/app.error';
import { AuditLogRepository } from '@/core/domain/repositories/audit-log.repository';
import { RoleRepository } from '@/core/domain/repositories/role.repository';
import {
  UpdateRoleInput,
  UpdateRoleOutput,
} from '../../contracts/role/update-role.contract';
import { UseCase } from '../use-case.interface';

/**
 * Use case to update an existing role.
 */
export class UpdateRoleUseCase implements UseCase<
  UpdateRoleInput,
  UpdateRoleOutput
> {
  constructor(
    private readonly roleRepository: RoleRepository,
    private readonly auditLogRepository: AuditLogRepository
  ) {}

  async execute(input: UpdateRoleInput): Promise<UpdateRoleOutput> {
    const { id, userId, ipAddress, userAgent, ...data } = input;

    // 1. Check if the role exists.
    const existing = await this.roleRepository.findById(id);
    if (!existing) {
      throw new NotFoundError('Role not found');
    }

    // 2. Check for duplicate code if it is being changed.
    if (data.code) {
      const roleWithCode = await this.roleRepository.findByCode(data.code);
      if (roleWithCode && roleWithCode.id !== id) {
        throw new ConflictError('Role code already exists');
      }
    }

    // 3. Update the role.
    const updatedRole = await this.roleRepository.update(id, data);

    // 4. Create audit log.
    await this.auditLogRepository.create({
      userId: userId || 'SYSTEM',
      action: 'UPDATE',
      entityName: 'ROLE',
      entityId: id,
      oldValues: existing,
      newValues: updatedRole,
      ipAddress,
      userAgent,
    });

    return updatedRole;
  }
}
