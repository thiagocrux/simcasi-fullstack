import { ConflictError } from '@/core/domain/errors/app.error';
import { AuditLogRepository } from '@/core/domain/repositories/audit-log.repository';
import { RoleRepository } from '@/core/domain/repositories/role.repository';
import {
  RegisterRoleInput,
  RegisterRoleOutput,
} from '../../contracts/role/register-role.contract';
import { UseCase } from '../use-case.interface';

/**
 * Use case to register a new role.
 */
export class RegisterRoleUseCase implements UseCase<
  RegisterRoleInput,
  RegisterRoleOutput
> {
  constructor(
    private readonly roleRepository: RoleRepository,
    private readonly auditLogRepository: AuditLogRepository
  ) {}

  async execute(input: RegisterRoleInput): Promise<RegisterRoleOutput> {
    const { ipAddress, userAgent, userId, ...roleData } = input;

    // 1. Check if the role code already exists, including soft-deleted records.
    // This allows us to reuse codes that were previously removed from the system.
    const roleExists = await this.roleRepository.findByCode(
      roleData.code,
      true
    );

    if (roleExists) {
      // If the role exists and is NOT deleted, we throw a conflict error.
      if (!roleExists.deletedAt) {
        throw new ConflictError('Role code already exists');
      }

      // If the role was previously soft-deleted, we restore it by clearing 'deletedAt'
      // and updating it with the new provided data (like permissions).
      const restoredRole = await this.roleRepository.update(roleExists.id, {
        code: roleData.code,
        permissionIds: roleData.permissionIds,
        deletedAt: null,
      });

      // 2. Log the 'RESTORE' action for audit trailing.
      await this.auditLogRepository.create({
        userId: userId || 'SYSTEM',
        action: 'RESTORE',
        entityName: 'ROLE',
        entityId: restoredRole.id,
        newValues: restoredRole,
        ipAddress,
        userAgent,
      });

      return restoredRole;
    }

    // 3. If no record was found with that code, create a completely new one.
    const role = await this.roleRepository.create({
      code: roleData.code,
      permissionIds: roleData.permissionIds,
    });

    // 4. Log the 'CREATE' action for audit trailing.
    await this.auditLogRepository.create({
      userId: userId || 'SYSTEM',
      action: 'CREATE',
      entityName: 'ROLE',
      entityId: role.id,
      newValues: role,
      ipAddress,
      userAgent,
    });

    return role;
  }
}
