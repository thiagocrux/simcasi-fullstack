import { AuditLog } from '@/core/domain/entities/audit-log.entity';

export interface GetAuditLogByIdInput {
  id: string;
}

export type GetAuditLogByIdOutput = AuditLog;
