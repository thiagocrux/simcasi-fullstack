import { FindSessionsUseCase } from '@/core/application/use-cases/session/find-sessions.use-case';
import { LoginUseCase } from '@/core/application/use-cases/session/login.use-case';
import { LogoutUseCase } from '@/core/application/use-cases/session/logout.use-case';
import { RefreshTokenUseCase } from '@/core/application/use-cases/session/refresh-token.use-case';
import { RevokeSessionUseCase } from '@/core/application/use-cases/session/revoke-session.use-case';
import { ValidateSessionUseCase } from '@/core/application/use-cases/session/validate-session.use-case';
import { PrismaAuditLogRepository } from '../repositories/prisma/audit-log.prisma.repository';
import { PrismaPermissionRepository } from '../repositories/prisma/permission.prisma.repository';
import { PrismaSessionRepository } from '../repositories/prisma/session.prisma.repository';
import { PrismaUserRepository } from '../repositories/prisma/user.prisma.repository';
import { makeHashProvider, makeTokenProvider } from './security.factory';

const sessionRepository = new PrismaSessionRepository();
const userRepository = new PrismaUserRepository();
const permissionRepository = new PrismaPermissionRepository();
const auditLogRepository = new PrismaAuditLogRepository();
const tokenProvider = makeTokenProvider();
const hashProvider = makeHashProvider();

/**
 * Factory function to create an instance of LoginUseCase.
 * Injects repositories for users, sessions, permissions, and security providers.
 * @returns A fully initialized LoginUseCase.
 */
export function makeLoginUseCase() {
  return new LoginUseCase(
    userRepository,
    sessionRepository,
    permissionRepository,
    hashProvider,
    tokenProvider
  );
}

/**
 * Factory function to create an instance of FindSessionsUseCase.
 * @returns A fully initialized FindSessionsUseCase.
 */
export function makeFindSessionsUseCase() {
  return new FindSessionsUseCase(sessionRepository, userRepository);
}

/**
 * Factory function to create an instance of RevokeSessionUseCase.
 * @returns A fully initialized RevokeSessionUseCase.
 */
export function makeRevokeSessionUseCase() {
  return new RevokeSessionUseCase(sessionRepository, auditLogRepository);
}

/**
 * Factory function to create an instance of LogoutUseCase.
 * @returns A fully initialized LogoutUseCase.
 */
export function makeLogoutUseCase() {
  return new LogoutUseCase(sessionRepository);
}

/**
 * Factory function to create an instance of RefreshTokenUseCase.
 * @returns A fully initialized RefreshTokenUseCase.
 */
export function makeRefreshTokenUseCase() {
  return new RefreshTokenUseCase(
    userRepository,
    sessionRepository,
    permissionRepository,
    tokenProvider
  );
}

/**
 * Factory function to create an instance of ValidateSessionUseCase.
 * @returns A fully initialized ValidateSessionUseCase.
 */
export function makeValidateSessionUseCase() {
  return new ValidateSessionUseCase(sessionRepository, tokenProvider);
}
