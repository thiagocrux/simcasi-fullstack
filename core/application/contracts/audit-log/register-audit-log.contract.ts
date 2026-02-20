import {
  Action,
  AuditLog,
  EntityName,
} from '@/core/domain/entities/audit-log.entity';

/** Input parameters for registering an audit log. */
export interface RegisterAuditLogInput {
  /** The ID of the user performing the action. */
  userId: string;
  /** The type of action performed. */
  action: Action;
  /** The name of the affected entity. */
  entityName: EntityName;
  /** The ID of the affected entity. */
  entityId: string;
  /** Data state before the change. */
  oldValues?: unknown;
  /** Data state after the change. */
  newValues?: unknown;
  /** IP address from which the request originated. */
  ipAddress?: string | null;
  /** User agent string of the client device. */
  userAgent?: string | null;
}

/** Output of the register audit log operation. */
export type RegisterAuditLogOutput = AuditLog;
