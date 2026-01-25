import { permissionSchema } from '@/core/application/validation/schemas/permission.schema';
import { ConflictError, ValidationError } from '@/core/domain/errors/app.error';
import { AuditLogRepository } from '@/core/domain/repositories/audit-log.repository';
import { PermissionRepository } from '@/core/domain/repositories/permission.repository';
import { formatZodError } from '@/core/application/validation/zod.utils';
import {
  RegisterPermissionInput,
  RegisterPermissionOutput,
} from '../../contracts/permission/register-permission.contract';
import { UseCase } from '../use-case.interface';

/**
 * Use case to register a new permission.
 */
export class RegisterPermissionUseCase implements UseCase<
  RegisterPermissionInput,
  RegisterPermissionOutput
> {
  constructor(
    private readonly permissionRepository: PermissionRepository,
    private readonly auditLogRepository: AuditLogRepository
  ) {}

  async execute(
    input: RegisterPermissionInput
  ): Promise<RegisterPermissionOutput> {
    const { userId, ipAddress, userAgent, ...data } = input;

    // 1. Validate input data using Zod schema.
    const validation = permissionSchema.safeParse(data);
    if (!validation.success) {
      throw new ValidationError(
        'Invalid register permission data.',
        formatZodError(validation.error)
      );
    }

    // 2. Check if the permission code already exists, including soft-deleted ones.
    const permissionExists = await this.permissionRepository.findByCode(
      data.code,
      true
    );

    if (permissionExists) {
      // If the permission exists and is NOT deleted, we throw a conflict error.
      if (!permissionExists.deletedAt) {
        throw new ConflictError('Permission code already exists');
      }

      // If it exists but was previously soft-deleted, we restore and update it.
      const restoredPermission = await this.permissionRepository.update(
        permissionExists.id,
        {
          ...validation.data,
          deletedAt: null,
        }
      );

      // 3. Log 'RESTORE' action for audit trailing.
      await this.auditLogRepository.create({
        userId: userId || 'SYSTEM',
        action: 'RESTORE',
        entityName: 'PERMISSION',
        entityId: restoredPermission.id,
        newValues: restoredPermission,
        ipAddress,
        userAgent,
      });

      return restoredPermission;
    }

    // 4. If no record was found, create a brand new permission.
    const permission = await this.permissionRepository.create(validation.data);

    // 5. Log 'CREATE' action for audit trailing.
    await this.auditLogRepository.create({
      userId: userId || 'SYSTEM',
      action: 'CREATE',
      entityName: 'PERMISSION',
      entityId: permission.id,
      newValues: permission,
      ipAddress,
      userAgent,
    });

    return permission;
  }
}
