import { ConflictError } from '@/core/domain/errors/app.error';
import { AuditLogRepository } from '@/core/domain/repositories/audit-log.repository';
import { PermissionRepository } from '@/core/domain/repositories/permission.repository';
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

    // 1. Check if the permission code already exists.
    const permissionExists = await this.permissionRepository.findByCode(
      data.code
    );
    if (permissionExists) {
      throw new ConflictError('Permission code already exists');
    }

    // 2. Delegate to the repository (handles restoration if the code was soft-deleted).
    const permission = await this.permissionRepository.create(data);

    // 3. Create audit log.
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
