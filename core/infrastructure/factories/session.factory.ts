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
 * Creates an instance of LoginUseCase.
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

export function makeFindSessionsUseCase() {
  return new FindSessionsUseCase(sessionRepository, userRepository);
}

export function makeRevokeSessionUseCase() {
  return new RevokeSessionUseCase(sessionRepository, auditLogRepository);
}

export function makeLogoutUseCase() {
  return new LogoutUseCase(sessionRepository);
}

export function makeRefreshTokenUseCase() {
  return new RefreshTokenUseCase(
    userRepository,
    sessionRepository,
    permissionRepository,
    tokenProvider
  );
}

export function makeValidateSessionUseCase() {
  return new ValidateSessionUseCase(sessionRepository, tokenProvider);
}
