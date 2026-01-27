import { NotFoundError } from '@/core/domain/errors/app.error';
import { AuditLogRepository } from '@/core/domain/repositories/audit-log.repository';
import { PermissionRepository } from '@/core/domain/repositories/permission.repository';
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
  constructor(
    private readonly permissionRepository: PermissionRepository,
    private readonly auditLogRepository: AuditLogRepository
  ) {}

  async execute(
    input: RestorePermissionInput
  ): Promise<RestorePermissionOutput> {
    const { id, userId, ipAddress, userAgent } = input;

    // 1. Check if the permission exists (including deleted).
    const permission = await this.permissionRepository.findById(id, true);
    if (!permission) {
      throw new NotFoundError('Permission not found');
    }

    // 2. Perform the restoration if it was deleted.
    if (permission.deletedAt) {
      await this.permissionRepository.restore(id, userId || 'SYSTEM');
    }

    const restoredPermission = (await this.permissionRepository.findById(
      id
    )) as RestorePermissionOutput;

    // 3. Create audit log.
    await this.auditLogRepository.create({
      userId: userId || 'SYSTEM',
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
