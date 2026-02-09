import {
  Action,
  AuditLog,
  EntityName,
} from '@/core/domain/entities/audit-log.entity';

export interface RegisterAuditLogInput {
  userId: string;
  action: Action;
  entityName: EntityName;
  entityId: string;
  oldValues?: unknown;
  newValues?: unknown;
  ipAddress?: string | null;
  userAgent?: string | null;
}

export type RegisterAuditLogOutput = AuditLog;
