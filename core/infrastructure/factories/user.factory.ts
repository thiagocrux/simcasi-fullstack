import { ChangePasswordUseCase } from '@/core/application/use-cases/user/change-password.use-case';
import { DeleteUserUseCase } from '@/core/application/use-cases/user/delete-user.use-case';
import { FindUsersUseCase } from '@/core/application/use-cases/user/find-users.use-case';
import { GetUserByIdUseCase } from '@/core/application/use-cases/user/get-user-by-id.use-case';
import { RegisterUserUseCase } from '@/core/application/use-cases/user/register-user.use-case';
import { RequestPasswordResetUseCase } from '@/core/application/use-cases/user/request-password-reset.use-case';
import { ResetPasswordUseCase } from '@/core/application/use-cases/user/reset-password.use-case';
import { RestoreUserUseCase } from '@/core/application/use-cases/user/restore-user.use-case';
import { UpdateUserUseCase } from '@/core/application/use-cases/user/update-user.use-case';
import { ValidatePasswordResetTokenUseCase } from '@/core/application/use-cases/user/validate-password-reset-token.use-case';
import { PrismaAuditLogRepository } from '../repositories/prisma/audit-log.prisma.repository';
import { PrismaPasswordResetTokenRepository } from '../repositories/prisma/password-reset-token.prisma.repository';
import { PrismaRoleRepository } from '../repositories/prisma/role.prisma.repository';
import { PrismaSessionRepository } from '../repositories/prisma/session.prisma.repository';
import { PrismaUserRepository } from '../repositories/prisma/user.prisma.repository';
import { makeMailProvider } from './mail.factory';
import { makeHashProvider } from './security.factory';

const userRepository = new PrismaUserRepository();
const roleRepository = new PrismaRoleRepository();
const hashProvider = makeHashProvider();
const auditLogRepository = new PrismaAuditLogRepository();
const sessionRepository = new PrismaSessionRepository();
const resetTokenRepository = new PrismaPasswordResetTokenRepository();

/**
 * Factory function to create an instance of RegisterUserUseCase.
 * Injects repositories for users, roles, audit logging, and a hash provider.
 * @return A fully initialized RegisterUserUseCase.
 */
export function makeRegisterUserUseCase() {
  return new RegisterUserUseCase(
    userRepository,
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
  return new FindUsersUseCase(userRepository);
}

/**
 * Factory function to create an instance of GetUserByIdUseCase.
 * @return A fully initialized GetUserByIdUseCase.
 */
export function makeGetUserByIdUseCase() {
  return new GetUserByIdUseCase(userRepository);
}

/**
 * Factory function to create an instance of UpdateUserUseCase.
 * @return A fully initialized UpdateUserUseCase.
 */
export function makeUpdateUserUseCase() {
  return new UpdateUserUseCase(
    userRepository,
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
    userRepository,
    sessionRepository,
    auditLogRepository
  );
}

/**
 * Factory function to create an instance of RestoreUserUseCase.
 * @return A fully initialized RestoreUserUseCase.
 */
export function makeRestoreUserUseCase() {
  return new RestoreUserUseCase(userRepository, auditLogRepository);
}

/**
 * Factory function to create an instance of RequestPasswordResetUseCase.
 * @returns A fully initialized RequestPasswordResetUseCase.
 */
export function makeRequestPasswordResetUseCase() {
  return new RequestPasswordResetUseCase(
    userRepository,
    resetTokenRepository,
    auditLogRepository,
    makeMailProvider()
  );
}

/**
 * Factory function to create an instance of ResetPasswordUseCase.
 * @returns A fully initialized ResetPasswordUseCase.
 */
export function makeResetPasswordUseCase() {
  return new ResetPasswordUseCase(
    userRepository,
    resetTokenRepository,
    hashProvider,
    auditLogRepository
  );
}

/**
 * Factory function to create an instance of ValidatePasswordResetTokenUseCase.
 * @returns A fully initialized ValidatePasswordResetTokenUseCase.
 */
export function makeValidatePasswordResetTokenUseCase() {
  return new ValidatePasswordResetTokenUseCase(
    resetTokenRepository,
    userRepository
  );
}

/**
 * Factory function to create an instance of ChangePasswordUseCase.
 * @returns A fully initialized ChangePasswordUseCase.
 */
export function makeChangePasswordUseCase() {
  return new ChangePasswordUseCase(
    userRepository,
    hashProvider,
    auditLogRepository
  );
}
