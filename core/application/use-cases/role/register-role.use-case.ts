import { ConflictError } from '@/core/domain/errors/app.error';
import { AuditLogRepository } from '@/core/domain/repositories/audit-log.repository';
import { RoleRepository } from '@/core/domain/repositories/role.repository';
import {
  RegisterRoleInput,
  RegisterRoleOutput,
} from '../../contracts/role/register-role.contract';
import { UseCase } from '../use-case.interface';

/**
 * Use case to register a new role.
 */
export class RegisterRoleUseCase implements UseCase<
  RegisterRoleInput,
  RegisterRoleOutput
> {
  constructor(
    private readonly roleRepository: RoleRepository,
    private readonly auditLogRepository: AuditLogRepository
  ) {}

  async execute(input: RegisterRoleInput): Promise<RegisterRoleOutput> {
    const { ipAddress, userAgent, userId, ...roleData } = input;

    // 1. Check if the role code already exists.
    const roleExists = await this.roleRepository.findByCode(roleData.code);
    if (roleExists) {
      throw new ConflictError('Role code already exists');
    }

    // 2. Delegate to the repository (handles restoration if the code was soft-deleted).
    const role = await this.roleRepository.create(roleData);

    // 3. Create audit log.
    await this.auditLogRepository.create({
      userId: userId || 'SYSTEM',
      action: 'CREATE',
      entityName: 'ROLE',
      entityId: role.id,
      newValues: role,
      ipAddress,
      userAgent,
    });

    return role;
  }
}
