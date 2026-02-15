import { permissionSchema } from '@/core/application/validation/schemas/permission.schema';
import { formatZodError } from '@/core/application/validation/zod.utils';
import { SYSTEM_CONSTANTS } from '@/core/domain/constants/system.constants';
import {
  ConflictError,
  NotFoundError,
  ValidationError,
} from '@/core/domain/errors/app.error';
import { AuditLogRepository } from '@/core/domain/repositories/audit-log.repository';
import { PermissionRepository } from '@/core/domain/repositories/permission.repository';
import { getRequestContext } from '@/core/infrastructure/lib/request-context';
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
  /**
   * Initializes a new instance of the UpdatePermissionUseCase class.
   *
   * @param permissionRepository The repository for permission persistence.
   * @param auditLogRepository The repository for audit logging.
   */
  constructor(
    private readonly permissionRepository: PermissionRepository,
    private readonly auditLogRepository: AuditLogRepository
  ) {}

  /**
   * Executes the use case to update an existing permission.
   *
   * @param input The data to update the permission.
   * @return A promise that resolves to the updated permission.
   * @throws {ValidationError} If the input data is invalid.
   * @throws {NotFoundError} If the permission is not found.
   * @throws {ConflictError} If the new permission code is already in use.
   */
  async execute(input: UpdatePermissionInput): Promise<UpdatePermissionOutput> {
    const { userId, ipAddress, userAgent } = getRequestContext();
    const { id, ...data } = input;

    // 1. Validate partial input.
    const validation = permissionSchema.partial().safeParse(data);
    if (!validation.success) {
      throw new ValidationError(
        'Dados de atualização de permissão inválidos.',
        formatZodError(validation.error)
      );
    }

    // 2. Check if the permission exists.
    const existing = await this.permissionRepository.findById(id);
    if (!existing) {
      throw new NotFoundError('Permissão');
    }

    // 3. Check for duplicate code if it is being changed.
    if (data.code) {
      const permissionWithCode = await this.permissionRepository.findByCode(
        data.code,
        true
      );
      if (permissionWithCode && permissionWithCode.id !== id) {
        throw new ConflictError('Esta permissão já existe.');
      }
    }

    // 4. Update the permission.
    const updatedPermission = await this.permissionRepository.update(
      id,
      {
        ...validation.data,
      },
      userId ?? SYSTEM_CONSTANTS.DEFAULT_SYSTEM_USER_ID
    );

    // 5. Create audit log.
    await this.auditLogRepository.create({
      userId: userId ?? SYSTEM_CONSTANTS.DEFAULT_SYSTEM_USER_ID,
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
