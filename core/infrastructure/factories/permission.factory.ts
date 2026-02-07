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

export function makeRegisterPermissionUseCase() {
  return new RegisterPermissionUseCase(
    permissionRepository,
    auditLogRepository
  );
}

export function makeFindPermissionsUseCase() {
  return new FindPermissionsUseCase(permissionRepository, userRepository);
}

export function makeGetPermissionByIdUseCase() {
  return new GetPermissionByIdUseCase(permissionRepository);
}

export function makeUpdatePermissionUseCase() {
  return new UpdatePermissionUseCase(permissionRepository, auditLogRepository);
}

export function makeDeletePermissionUseCase() {
  return new DeletePermissionUseCase(permissionRepository, auditLogRepository);
}

export function makeRestorePermissionUseCase() {
  return new RestorePermissionUseCase(permissionRepository, auditLogRepository);
}

export function makeValidatePermissionsUseCase() {
  return new ValidatePermissionsUseCase(roleRepository);
}
