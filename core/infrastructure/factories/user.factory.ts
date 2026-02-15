import { DeleteUserUseCase } from '@/core/application/use-cases/user/delete-user.use-case';
import { FindUsersUseCase } from '@/core/application/use-cases/user/find-users.use-case';
import { GetUserByIdUseCase } from '@/core/application/use-cases/user/get-user-by-id.use-case';
import { RegisterUserUseCase } from '@/core/application/use-cases/user/register-user.use-case';
import { RestoreUserUseCase } from '@/core/application/use-cases/user/restore-user.use-case';
import { UpdateUserUseCase } from '@/core/application/use-cases/user/update-user.use-case';
import { PrismaAuditLogRepository } from '../repositories/prisma/audit-log.prisma.repository';
import { PrismaRoleRepository } from '../repositories/prisma/role.prisma.repository';
import { PrismaSessionRepository } from '../repositories/prisma/session.prisma.repository';
import { PrismaUserRepository } from '../repositories/prisma/user.prisma.repository';
import { makeHashProvider } from './security.factory';

const repository = new PrismaUserRepository();
const roleRepository = new PrismaRoleRepository();
const hashProvider = makeHashProvider();
const auditLogRepository = new PrismaAuditLogRepository();
const sessionRepository = new PrismaSessionRepository();

/**
 * Factory function to create an instance of RegisterUserUseCase.
 * Injects repositories for users, roles, audit logging, and a hash provider.
 * @return A fully initialized RegisterUserUseCase.
 */
export function makeRegisterUserUseCase() {
  return new RegisterUserUseCase(
    repository,
    roleRepository,
    hashProvider,
    auditLogRepository
  );
}

/**
 * Factory function to create an instance of FindUsersUseCase.
 * @return A fully initialized FindUsersUseCase.
 */
export function makeFindUsersUseCase() {
  return new FindUsersUseCase(repository);
}

/**
 * Factory function to create an instance of GetUserByIdUseCase.
 * @return A fully initialized GetUserByIdUseCase.
 */
export function makeGetUserByIdUseCase() {
  return new GetUserByIdUseCase(repository);
}

/**
 * Factory function to create an instance of UpdateUserUseCase.
 * @return A fully initialized UpdateUserUseCase.
 */
export function makeUpdateUserUseCase() {
  return new UpdateUserUseCase(
    repository,
    roleRepository,
    hashProvider,
    auditLogRepository
  );
}

/**
 * Factory function to create an instance of DeleteUserUseCase.
 * @return A fully initialized DeleteUserUseCase.
 */
export function makeDeleteUserUseCase() {
  return new DeleteUserUseCase(
    repository,
    sessionRepository,
    auditLogRepository
  );
}

/**
 * Factory function to create an instance of RestoreUserUseCase.
 * @return A fully initialized RestoreUserUseCase.
 */
export function makeRestoreUserUseCase() {
  return new RestoreUserUseCase(repository, auditLogRepository);
}
