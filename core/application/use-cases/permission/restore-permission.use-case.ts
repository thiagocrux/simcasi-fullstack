import { SYSTEM_CONSTANTS } from '@/core/domain/constants/system.constants';
import { NotFoundError } from '@/core/domain/errors/app.error';
import { AuditLogRepository } from '@/core/domain/repositories/audit-log.repository';
import { PermissionRepository } from '@/core/domain/repositories/permission.repository';
import { getRequestContext } from '@/core/infrastructure/lib/request-context';
import {
  RestorePermissionInput,
  RestorePermissionOutput,
} from '../../contracts/permission/restore-permission.contract';
import { UseCase } from '../use-case.interface';

/**
 * Use case to restore a soft-deleted permission.
 */
export class RestorePermissionUseCase implements UseCase<
  RestorePermissionInput,
  RestorePermissionOutput
> {
  /**
   * Initializes a new instance of the RestorePermissionUseCase class.
   *
   * @param permissionRepository The repository for permission persistence.
   * @param auditLogRepository The repository for audit logging.
   */
  constructor(
    private readonly permissionRepository: PermissionRepository,
    private readonly auditLogRepository: AuditLogRepository
  ) {}

  /**
   * Executes the use case to restore a soft-deleted permission.
   *
   * @param input The data containing the permission ID.
   * @return A promise that resolves to the restored permission.
   * @throws {NotFoundError} If the permission is not found.
   */
  async execute(
    input: RestorePermissionInput
  ): Promise<RestorePermissionOutput> {
    const { userId, ipAddress, userAgent } = getRequestContext();
    const { id } = input;

    // 1. Check if the permission exists (including deleted).
    const permission = await this.permissionRepository.findById(id, true);
    if (!permission) {
      throw new NotFoundError('Permissão');
    }

    // 2. Perform the restoration if it was deleted.
    if (permission.deletedAt) {
      await this.permissionRepository.restore(
        id,
        userId ?? SYSTEM_CONSTANTS.DEFAULT_SYSTEM_USER_ID
      );
    }

    const restoredPermission = (await this.permissionRepository.findById(
      id
    )) as RestorePermissionOutput;

    // 3. Create audit log.
    await this.auditLogRepository.create({
      userId: userId ?? SYSTEM_CONSTANTS.DEFAULT_SYSTEM_USER_ID,
      action: 'RESTORE',
      entityName: 'PERMISSION',
      entityId: id,
      newValues: restoredPermission,
      ipAddress,
      userAgent,
    });

    return restoredPermission;
  }
}
