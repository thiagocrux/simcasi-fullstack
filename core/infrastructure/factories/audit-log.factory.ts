import { FindAuditLogsUseCase } from '@/core/application/use-cases/audit-log/find-audit-logs.use-case';
import { GetAuditLogByIdUseCase } from '@/core/application/use-cases/audit-log/get-audit-log-by-id.use-case';
import { RegisterAuditLogUseCase } from '@/core/application/use-cases/audit-log/register-audit-log.use-case';
import { PrismaAuditLogRepository } from '../repositories/prisma/audit-log.prisma.repository';

const auditLogRepository = new PrismaAuditLogRepository();

export function makeFindAuditLogsUseCase() {
  return new FindAuditLogsUseCase(auditLogRepository);
}

export function makeGetAuditLogByIdUseCase() {
  return new GetAuditLogByIdUseCase(auditLogRepository);
}

export function makeRegisterAuditLogUseCase() {
  return new RegisterAuditLogUseCase(auditLogRepository);
}
