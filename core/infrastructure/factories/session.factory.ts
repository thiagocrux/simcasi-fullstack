import { FindSessionsUseCase } from '@/core/application/use-cases/session/find-sessions.use-case';
import { LoginUseCase } from '@/core/application/use-cases/session/login.use-case';
import { LogoutUseCase } from '@/core/application/use-cases/session/logout.use-case';
import { RefreshTokenUseCase } from '@/core/application/use-cases/session/refresh-token.use-case';
import { RevokeSessionUseCase } from '@/core/application/use-cases/session/revoke-session.use-case';
import { ValidateSessionUseCase } from '@/core/application/use-cases/session/validate-session.use-case';
import { BcryptHashProvider } from '../providers/bcrypt-hash.provider';
import { JoseTokenProvider } from '../providers/jose-token.provider';
import { PrismaAuditLogRepository } from '../repositories/prisma/audit-log.prisma.repository';
import { PrismaSessionRepository } from '../repositories/prisma/session.prisma.repository';
import { PrismaUserRepository } from '../repositories/prisma/user.prisma.repository';

const sessionRepository = new PrismaSessionRepository();
const userRepository = new PrismaUserRepository();
const auditLogRepository = new PrismaAuditLogRepository();
const tokenProvider = new JoseTokenProvider();
const hashProvider = new BcryptHashProvider();

export function makeLoginUseCase() {
  return new LoginUseCase(
    userRepository,
    sessionRepository,
    hashProvider,
    tokenProvider
  );
}

export function makeFindSessionsUseCase() {
  return new FindSessionsUseCase(sessionRepository);
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
    tokenProvider
  );
}

export function makeValidateSessionUseCase() {
  return new ValidateSessionUseCase(sessionRepository, tokenProvider);
}
