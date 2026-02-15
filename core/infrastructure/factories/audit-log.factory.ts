import { FindAuditLogsUseCase } from '@/core/application/use-cases/audit-log/find-audit-logs.use-case';
import { GetAuditLogByIdUseCase } from '@/core/application/use-cases/audit-log/get-audit-log-by-id.use-case';
import { RegisterAuditLogUseCase } from '@/core/application/use-cases/audit-log/register-audit-log.use-case';
import { PrismaAuditLogRepository } from '../repositories/prisma/audit-log.prisma.repository';
import { PrismaUserRepository } from '../repositories/prisma/user.prisma.repository';

const auditLogRepository = new PrismaAuditLogRepository();
const userRepository = new PrismaUserRepository();

/**
 * Factory function to create an instance of FindAuditLogsUseCase.
 * Injects the required repositories for audit logs and user data.
 * @return A fully initialized FindAuditLogsUseCase.
 */
export function makeFindAuditLogsUseCase() {
  return new FindAuditLogsUseCase(auditLogRepository, userRepository);
}

/**
 * Factory function to create an instance of GetAuditLogByIdUseCase.
 * @return A fully initialized GetAuditLogByIdUseCase.
 */
export function makeGetAuditLogByIdUseCase() {
  return new GetAuditLogByIdUseCase(auditLogRepository);
}

/**
 * Factory function to create an instance of RegisterAuditLogUseCase.
 * @return A fully initialized RegisterAuditLogUseCase.
 */
export function makeRegisterAuditLogUseCase() {
  return new RegisterAuditLogUseCase(auditLogRepository);
}
