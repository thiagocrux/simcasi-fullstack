import { roleSchema } from '@/core/application/validation/schemas/role.schema';
import { formatZodError } from '@/core/application/validation/zod.utils';
import {
  ConflictError,
  NotFoundError,
  ValidationError,
} from '@/core/domain/errors/app.error';
import { AuditLogRepository } from '@/core/domain/repositories/audit-log.repository';
import { PermissionRepository } from '@/core/domain/repositories/permission.repository';
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
    private readonly permissionRepository: PermissionRepository,
    private readonly auditLogRepository: AuditLogRepository
  ) {}

  async execute(input: RegisterRoleInput): Promise<RegisterRoleOutput> {
    const { ipAddress, userAgent, userId, ...roleData } = input;

    // 1. Validate input data using Zod schema.
    const validation = roleSchema.safeParse(roleData);
    if (!validation.success) {
      throw new ValidationError(
        'Invalid register role data.',
        formatZodError(validation.error)
      );
    }

    // 2. Validate if permissions exist.
    if (roleData.permissionIds && roleData.permissionIds.length > 0) {
      const foundPermissions = await this.permissionRepository.findByIds(
        roleData.permissionIds
      );
      if (foundPermissions.length !== roleData.permissionIds.length) {
        throw new NotFoundError('One or more permissions');
      }
    }

    // 3. Check if the role code already exists, including soft-deleted records.
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
        updatedBy: userId || 'SYSTEM',
      });

      // 4. Log the 'RESTORE' action for audit trailing.
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

    // 5. If no record was found with that code, create a completely new one.
    const role = await this.roleRepository.create({
      code: roleData.code,
      permissionIds: roleData.permissionIds,
      createdBy: userId || 'SYSTEM',
      updatedBy: null,
    });

    // 6. Log the 'CREATE' action for audit trailing.
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
