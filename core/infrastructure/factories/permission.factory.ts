import { DeletePermissionUseCase } from '@/core/application/use-cases/permission/delete-permission.use-case';
import { FindPermissionsUseCase } from '@/core/application/use-cases/permission/find-permissions.use-case';
import { GetPermissionByIdUseCase } from '@/core/application/use-cases/permission/get-permission-by-id.use-case';
import { RegisterPermissionUseCase } from '@/core/application/use-cases/permission/register-permission.use-case';
import { RestorePermissionUseCase } from '@/core/application/use-cases/permission/restore-permission.use-case';
import { UpdatePermissionUseCase } from '@/core/application/use-cases/permission/update-permission.use-case';
import { ValidatePermissionsUseCase } from '@/core/application/use-cases/permission/validate-permissions.use-case';
import { PrismaAuditLogRepository } from '../repositories/prisma/audit-log.prisma.repository';
import { PrismaPermissionRepository } from '../repositories/prisma/permission.prisma.repository';
import { PrismaRoleRepository } from '../repositories/prisma/role.prisma.repository';
import { PrismaUserRepository } from '../repositories/prisma/user.prisma.repository';

const permissionRepository = new PrismaPermissionRepository();
const roleRepository = new PrismaRoleRepository();
const auditLogRepository = new PrismaAuditLogRepository();
const userRepository = new PrismaUserRepository();

/**
 * Factory function to create an instance of RegisterPermissionUseCase.
 * @return A fully initialized RegisterPermissionUseCase.
 */
export function makeRegisterPermissionUseCase() {
  return new RegisterPermissionUseCase(
    permissionRepository,
    auditLogRepository
  );
}

/**
 * Factory function to create an instance of FindPermissionsUseCase.
 * @return A fully initialized FindPermissionsUseCase.
 */
export function makeFindPermissionsUseCase() {
  return new FindPermissionsUseCase(permissionRepository, userRepository);
}

/**
 * Factory function to create an instance of GetPermissionByIdUseCase.
 * @return A fully initialized GetPermissionByIdUseCase.
 */
export function makeGetPermissionByIdUseCase() {
  return new GetPermissionByIdUseCase(permissionRepository);
}

/**
 * Factory function to create an instance of UpdatePermissionUseCase.
 * @return A fully initialized UpdatePermissionUseCase.
 */
export function makeUpdatePermissionUseCase() {
  return new UpdatePermissionUseCase(permissionRepository, auditLogRepository);
}

/**
 * Factory function to create an instance of DeletePermissionUseCase.
 * @return A fully initialized DeletePermissionUseCase.
 */
export function makeDeletePermissionUseCase() {
  return new DeletePermissionUseCase(permissionRepository, auditLogRepository);
}

/**
 * Factory function to create an instance of RestorePermissionUseCase.
 * @return A fully initialized RestorePermissionUseCase.
 */
export function makeRestorePermissionUseCase() {
  return new RestorePermissionUseCase(permissionRepository, auditLogRepository);
}

/**
 * Factory function to create an instance of ValidatePermissionsUseCase.
 * @return A fully initialized ValidatePermissionsUseCase.
 */
export function makeValidatePermissionsUseCase() {
  return new ValidatePermissionsUseCase(roleRepository);
}
