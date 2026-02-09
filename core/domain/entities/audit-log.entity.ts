import {
  AUDIT_LOG_ACTIONS,
  AUDIT_LOG_ENTITY_NAMES,
} from '../constants/audit-log.constants';

/**
 * Represents the type for actions recorded in the audit log.
 */
export type Action = (typeof AUDIT_LOG_ACTIONS)[number];

/**
 * Represents the type for entity names targets in the audit log.
 */
export type EntityName = (typeof AUDIT_LOG_ENTITY_NAMES)[number];

export interface AuditLog {
  id: string;
  userId: string;
  action: Action;
  entityName: EntityName;
  entityId: string;
  oldValues?: unknown;
  newValues?: unknown;
  ipAddress?: string | null;
  userAgent?: string | null;
  createdAt: Date;
}
