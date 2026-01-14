import { AuditLog } from '@/core/domain/entities/audit-log.entity';

export interface RegisterAuditLogInput {
  userId: string;
  action: string;
  entityName: string;
  entityId: string;
  oldValues?: unknown;
  newValues?: unknown;
  ipAddress?: string | null;
  userAgent?: string | null;
}

export type RegisterAuditLogOutput = AuditLog;
