import { SYSTEM_CONSTANTS } from '@/core/domain/constants/system.constants';
import { NotFoundError } from '@/core/domain/errors/app.error';
import { AuditLogRepository } from '@/core/domain/repositories/audit-log.repository';
import { RoleRepository } from '@/core/domain/repositories/role.repository';
import {
  RestoreRoleInput,
  RestoreRoleOutput,
} from '../../contracts/role/restore-role.contract';
import { UseCase } from '../use-case.interface';

/**
 * Use case to restore a soft-deleted role.
 */
export class RestoreRoleUseCase implements UseCase<
  RestoreRoleInput,
  RestoreRoleOutput
> {
  /**
   * Initializes a new instance of the RestoreRoleUseCase class.
   *
   * @param roleRepository The repository for role persistence.
   * @param auditLogRepository The repository for audit logging.
   */
  constructor(
    private readonly roleRepository: RoleRepository,
    private readonly auditLogRepository: AuditLogRepository
  ) {}

  /**
   * Executes the use case to restore a soft-deleted role.
   *
   * @param input The data containing the role ID and auditor info.
   * @return A promise that resolves to the restored role.
   * @throws {NotFoundError} If the role is not found.
   */
  async execute(input: RestoreRoleInput): Promise<RestoreRoleOutput> {
    const { id, userId, ipAddress, userAgent } = input;

    // 1. Check if the role exists (including deleted).
    const role = await this.roleRepository.findById(id, true);
    if (!role) {
      throw new NotFoundError('Role not found');
    }

    // 2. Perform the restoration if it was deleted.
    if (role.deletedAt) {
      await this.roleRepository.restore(
        id,
        userId ?? SYSTEM_CONSTANTS.DEFAULT_SYSTEM_USER_ID
      );
    }

    const restoredRole = (await this.roleRepository.findById(
      id
    )) as RestoreRoleOutput;

    // 3. Create audit log.
    await this.auditLogRepository.create({
      userId: userId ?? SYSTEM_CONSTANTS.DEFAULT_SYSTEM_USER_ID,
      action: 'RESTORE',
      entityName: 'ROLE',
      entityId: id,
      newValues: restoredRole,
      ipAddress,
      userAgent,
    });

    return restoredRole;
  }
}
