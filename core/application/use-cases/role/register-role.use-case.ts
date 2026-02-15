import { roleSchema } from '@/core/application/validation/schemas/role.schema';
import { formatZodError } from '@/core/application/validation/zod.utils';
import { SYSTEM_CONSTANTS } from '@/core/domain/constants/system.constants';
import {
  ConflictError,
  NotFoundError,
  ValidationError,
} from '@/core/domain/errors/app.error';
import { AuditLogRepository } from '@/core/domain/repositories/audit-log.repository';
import { PermissionRepository } from '@/core/domain/repositories/permission.repository';
import { RoleRepository } from '@/core/domain/repositories/role.repository';
import { getRequestContext } from '@/core/infrastructure/lib/request-context';
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
  /**
   * Initializes a new instance of the RegisterRoleUseCase class.
   *
   * @param roleRepository The repository for role persistence.
   * @param permissionRepository The repository for permission validation.
   * @param auditLogRepository The repository for audit logging.
   */
  constructor(
    private readonly roleRepository: RoleRepository,
    private readonly permissionRepository: PermissionRepository,
    private readonly auditLogRepository: AuditLogRepository
  ) {}

  /**
   * Executes the use case to register a new role.
   *
   * @param input The data for the new role.
   * @return A promise that resolves to the registered or restored role.
   * @throws {ValidationError} If the input data is invalid.
   * @throws {ConflictError} If a role with the same name already exists.
   * @throws {NotFoundError} If one or more provided permissions are not found.
   */
  async execute(input: RegisterRoleInput): Promise<RegisterRoleOutput> {
    const { userId, ipAddress, userAgent } = getRequestContext();

    // 1. Validate input data using Zod schema.
    const validation = roleSchema.safeParse(input);
    if (!validation.success) {
      throw new ValidationError(
        'Dados de criação de cargo inválidos.',
        formatZodError(validation.error)
      );
    }

    // 2. Validate if permissions exist.
    if (input.permissionIds && input.permissionIds.length > 0) {
      const foundPermissions = await this.permissionRepository.findByIds(
        input.permissionIds
      );
      if (foundPermissions.length !== input.permissionIds.length) {
        throw new NotFoundError(
          'Uma ou mais permissões não foram encontradas',
          true
        );
      }
    }

    // 3. Check if the role code already exists, including soft-deleted records.
    const roleExists = await this.roleRepository.findByCode(input.code, true);

    if (roleExists) {
      // If the role exists and is NOT deleted, we throw a conflict error.
      if (!roleExists.deletedAt) {
        throw new ConflictError('Este cargo já existe.');
      }

      // If the role was previously soft-deleted, we restore it by clearing 'deletedAt'
      // and updating it with the new provided data (like permissions).
      const restoredRole = await this.roleRepository.update(
        roleExists.id,
        {
          code: input.code,
          permissionIds: input.permissionIds,
          deletedAt: null,
        },
        userId ?? SYSTEM_CONSTANTS.DEFAULT_SYSTEM_USER_ID
      );

      // 4. Log the 'RESTORE' action for audit trailing.
      await this.auditLogRepository.create({
        userId: userId ?? SYSTEM_CONSTANTS.DEFAULT_SYSTEM_USER_ID,
        action: 'RESTORE',
        entityName: 'ROLE',
        entityId: restoredRole.id,
        newValues: restoredRole,
        ipAddress,
        userAgent,
      });

      return restoredRole;
    }

    // 5. If no record was found with that code, create a completely new one.
    const role = await this.roleRepository.create({
      code: input.code,
      label: input.label,
      permissionIds: input.permissionIds,
      createdBy: userId ?? SYSTEM_CONSTANTS.DEFAULT_SYSTEM_USER_ID,
      updatedBy: null,
    });

    // 6. Log the 'CREATE' action for audit trailing.
    await this.auditLogRepository.create({
      userId: userId ?? SYSTEM_CONSTANTS.DEFAULT_SYSTEM_USER_ID,
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
