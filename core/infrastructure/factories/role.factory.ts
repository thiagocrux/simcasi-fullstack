import { DeleteRoleUseCase } from '@/core/application/use-cases/role/delete-role.use-case';
import { FindRolesUseCase } from '@/core/application/use-cases/role/find-roles.use-case';
import { GetRoleByIdUseCase } from '@/core/application/use-cases/role/get-role-by-id.use-case';
import { RegisterRoleUseCase } from '@/core/application/use-cases/role/register-role.use-case';
import { RestoreRoleUseCase } from '@/core/application/use-cases/role/restore-role.use-case';
import { UpdateRoleUseCase } from '@/core/application/use-cases/role/update-role.use-case';
import { PrismaAuditLogRepository } from '../repositories/prisma/audit-log.prisma.repository';
import { PrismaRoleRepository } from '../repositories/prisma/role.prisma.repository';

const roleRepository = new PrismaRoleRepository();
const auditLogRepository = new PrismaAuditLogRepository();

export function makeRegisterRoleUseCase() {
  return new RegisterRoleUseCase(roleRepository, auditLogRepository);
}

export function makeFindRolesUseCase() {
  return new FindRolesUseCase(roleRepository);
}

export function makeGetRoleByIdUseCase() {
  return new GetRoleByIdUseCase(roleRepository);
}

export function makeUpdateRoleUseCase() {
  return new UpdateRoleUseCase(roleRepository, auditLogRepository);
}

export function makeDeleteRoleUseCase() {
  return new DeleteRoleUseCase(roleRepository, auditLogRepository);
}

export function makeRestoreRoleUseCase() {
  return new RestoreRoleUseCase(roleRepository, auditLogRepository);
}
