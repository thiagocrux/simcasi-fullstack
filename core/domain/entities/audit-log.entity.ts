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

/**
 * Represents a record in the system's security audit log.
 * Provides accountability and traceability for sensitive clinical data access and changes.
 * Essential for compliance with LGPD (General Data Protection Law).
 */
export interface AuditLog {
  /** Unique identifier for the audit record. */
  id: string;
  /** Reference to the user who performed the action. */
  userId: string;
  /** The type of operation performed (Create, Update, Delete, etc.). */
  action: Action;
  /** The name of the affected entity (Patient, Exam, etc.). */
  entityName: EntityName;
  /** Unique identifier of the record that was affected. */
  entityId: string;
  /** State of the record before the action was performed. */
  oldValues?: unknown;
  /** State of the record after the action was performed. */
  newValues?: unknown;
  /** IPv4 or IPv6 address from which the request originated. */
  ipAddress?: string | null;
  /** Client browser or application string that performed the action. */
  userAgent?: string | null;
  /** Timestamp when the event was recorded. */
  createdAt: Date;
}
