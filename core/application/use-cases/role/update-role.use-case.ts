import { roleSchema } from '@/core/application/validation/schemas/role.schema';
import { formatZodError } from '@/core/application/validation/zod.utils';
import { SYSTEM_CONSTANTS } from '@/core/domain/constants/system.constants';
import {
  ConflictError,
  NotFoundError,
  ValidationError,
} from '@/core/domain/errors/app.error';
import { AuditLogRepository } from '@/core/domain/repositories/audit-log.repository';
import { PermissionRepository } from '@/core/domain/repositories/permission.repository';
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
    private readonly permissionRepository: PermissionRepository,
    private readonly auditLogRepository: AuditLogRepository
  ) {}

  async execute(input: UpdateRoleInput): Promise<UpdateRoleOutput> {
    const { id, userId, ipAddress, userAgent, ...data } = input;

    // 1. Validate partial input.
    const validation = roleSchema.partial().safeParse(data);
    if (!validation.success) {
      throw new ValidationError(
        'Invalid update role data.',
        formatZodError(validation.error)
      );
    }

    // 2. Validate if permissions exist (if provided).
    if (data.permissionIds && data.permissionIds.length > 0) {
      const foundPermissions = await this.permissionRepository.findByIds(
        data.permissionIds
      );
      if (foundPermissions.length !== data.permissionIds.length) {
        throw new NotFoundError('One or more permissions');
      }
    }

    // 3. Check if the role exists.
    const existing = await this.roleRepository.findById(id);
    if (!existing) {
      throw new NotFoundError('Role');
    }

    // 4. Check for duplicate code if it is being changed.
    if (data.code) {
      const roleWithCode = await this.roleRepository.findByCode(
        data.code,
        true
      );
      if (roleWithCode && roleWithCode.id !== id) {
        throw new ConflictError('Role code already exists');
      }
    }

    // 5. Update the role.
    const updatedRole = await this.roleRepository.update(id, {
      ...validation.data,
      updatedBy: userId ?? SYSTEM_CONSTANTS.DEFAULT_SYSTEM_USER_ID,
    });

    // 6. Create audit log.
    await this.auditLogRepository.create({
      userId: userId ?? SYSTEM_CONSTANTS.DEFAULT_SYSTEM_USER_ID,
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
