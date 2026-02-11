import { SYSTEM_CONSTANTS } from '@/core/domain/constants/system.constants';
import { NotFoundError } from '@/core/domain/errors/app.error';
import { AuditLogRepository } from '@/core/domain/repositories/audit-log.repository';
import { PermissionRepository } from '@/core/domain/repositories/permission.repository';
import {
  DeletePermissionInput,
  DeletePermissionOutput,
} from '../../contracts/permission/delete-permission.contract';
import { UseCase } from '../use-case.interface';

/**
 * Use case to soft delete a permission.
 */
export class DeletePermissionUseCase implements UseCase<
  DeletePermissionInput,
  DeletePermissionOutput
> {
  /**
   * Initializes a new instance of the DeletePermissionUseCase class.
   *
   * @param permissionRepository The repository for permission persistence.
   * @param auditLogRepository The repository for audit logging.
   */
  constructor(
    private readonly permissionRepository: PermissionRepository,
    private readonly auditLogRepository: AuditLogRepository
  ) {}

  /**
   * Executes the use case to soft delete a permission.
   *
   * @param input The data containing the permission ID and auditor info.
   * @return A promise that resolves when the deletion is complete.
   * @throws {NotFoundError} If the permission is not found.
   */
  async execute(input: DeletePermissionInput): Promise<DeletePermissionOutput> {
    const { id, userId, ipAddress, userAgent } = input;

    // 1. Check if the permission exists.
    const existing = await this.permissionRepository.findById(id);
    if (!existing) {
      throw new NotFoundError('Permission not found');
    }

    // 2. Soft delete the permission.
    await this.permissionRepository.softDelete(
      id,
      userId ?? SYSTEM_CONSTANTS.DEFAULT_SYSTEM_USER_ID
    );

    // 3. Create audit log.
    await this.auditLogRepository.create({
      userId: userId ?? SYSTEM_CONSTANTS.DEFAULT_SYSTEM_USER_ID,
      action: 'DELETE',
      entityName: 'PERMISSION',
      entityId: id,
      oldValues: existing,
      ipAddress,
      userAgent,
    });
  }
}
