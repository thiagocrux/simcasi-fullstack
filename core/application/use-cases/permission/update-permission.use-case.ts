import { permissionSchema } from '@/core/application/validation/schemas/permission.schema';
import { formatZodError } from '@/core/application/validation/zod.utils';
import {
  ConflictError,
  NotFoundError,
  ValidationError,
} from '@/core/domain/errors/app.error';
import { AuditLogRepository } from '@/core/domain/repositories/audit-log.repository';
import { PermissionRepository } from '@/core/domain/repositories/permission.repository';
import {
  UpdatePermissionInput,
  UpdatePermissionOutput,
} from '../../contracts/permission/update-permission.contract';
import { UseCase } from '../use-case.interface';

/**
 * Use case to update an existing permission.
 */
export class UpdatePermissionUseCase implements UseCase<
  UpdatePermissionInput,
  UpdatePermissionOutput
> {
  constructor(
    private readonly permissionRepository: PermissionRepository,
    private readonly auditLogRepository: AuditLogRepository
  ) {}

  async execute(input: UpdatePermissionInput): Promise<UpdatePermissionOutput> {
    const { id, userId, ipAddress, userAgent, ...data } = input;

    // 1. Validate partial input.
    const validation = permissionSchema.partial().safeParse(data);
    if (!validation.success) {
      throw new ValidationError(
        'Invalid update permission data.',
        formatZodError(validation.error)
      );
    }

    // 2. Check if the permission exists.
    const existing = await this.permissionRepository.findById(id);
    if (!existing) {
      throw new NotFoundError('Permission');
    }

    // 3. Check for duplicate code if it is being changed.
    if (data.code) {
      const permissionWithCode = await this.permissionRepository.findByCode(
        data.code,
        true
      );
      if (permissionWithCode && permissionWithCode.id !== id) {
        throw new ConflictError('Permission code already exists');
      }
    }

    // 4. Update the permission.
    const updatedPermission = await this.permissionRepository.update(id, {
      ...validation.data,
      updatedBy: userId || 'SYSTEM',
    });

    // 5. Create audit log.
    await this.auditLogRepository.create({
      userId: userId || 'SYSTEM',
      action: 'UPDATE',
      entityName: 'PERMISSION',
      entityId: id,
      oldValues: existing,
      newValues: updatedPermission,
      ipAddress,
      userAgent,
    });

    return updatedPermission;
  }
}
