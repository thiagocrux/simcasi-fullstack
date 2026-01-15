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
  constructor(
    private readonly permissionRepository: PermissionRepository,
    private readonly auditLogRepository: AuditLogRepository
  ) {}

  async execute(input: DeletePermissionInput): Promise<DeletePermissionOutput> {
    const { id, userId, ipAddress, userAgent } = input;

    // 1. Check if the permission exists.
    const existing = await this.permissionRepository.findById(id);
    if (!existing) {
      throw new NotFoundError('Permission not found');
    }

    // 2. Soft delete the permission.
    await this.permissionRepository.softDelete(id);

    // 3. Create audit log.
    await this.auditLogRepository.create({
      userId: userId || 'SYSTEM',
      action: 'DELETE',
      entityName: 'PERMISSION',
      entityId: id,
      oldValues: existing,
      ipAddress,
      userAgent,
    });
  }
}
