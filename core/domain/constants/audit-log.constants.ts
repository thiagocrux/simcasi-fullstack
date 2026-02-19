/**
 * Fields of the Audit Log entity that are allowed for sorting in list requests.
 */
export const AUDIT_LOG_SORTABLE_FIELDS = [
  'id',
  'userId',
  'action',
  'entityName',
  'entityId',
  'createdAt',
] as const;

/**
 * Fields of the Audit Log entity that are allowed for text search.
 */
export const AUDIT_LOG_SEARCHABLE_FIELDS = [
  'action',
  'entityName',
  'entityId',
  'ipAddress',
  'userAgent',
] as const;

/**
 * Valid actions that can be recorded in the Audit Log.
 */
export const AUDIT_LOG_ACTIONS = [
  'CREATE',
  'UPDATE',
  'DELETE',
  'RESTORE',
  'REVOKE_SESSION',
  'PASSWORD_CHANGE',
  'PASSWORD_RESET',
  'PASSWORD_RESET_REQUEST',
] as const;

/**
 * Audit Log Actions mapped to constants for use in code.
 */
export const AUDIT_LOG_ACTION = {
  CREATE: 'CREATE',
  UPDATE: 'UPDATE',
  DELETE: 'DELETE',
  RESTORE: 'RESTORE',
  REVOKE_SESSION: 'REVOKE_SESSION',
  PASSWORD_CHANGE: 'PASSWORD_CHANGE',
  PASSWORD_RESET: 'PASSWORD_RESET',
  PASSWORD_RESET_REQUEST: 'PASSWORD_RESET_REQUEST',
} as const;

/**
 * Valid entity names that can be targets of Audit Log actions.
 * Groups all clinical and administrative entities tracked by the system.
 */
export const AUDIT_LOG_ENTITY_NAMES = [
  'EXAM',
  'NOTIFICATION',
  'SESSION',
  'TREATMENT',
  'PERMISSION',
  'PATIENT',
  'USER',
  'OBSERVATION',
  'ROLE',
] as const;

/**
 * Audit Log entity names mapped to constants for type-safe reference.
 */
export const AUDIT_LOG_ENTITY = {
  EXAM: 'EXAM',
  NOTIFICATION: 'NOTIFICATION',
  SESSION: 'SESSION',
  TREATMENT: 'TREATMENT',
  PERMISSION: 'PERMISSION',
  PATIENT: 'PATIENT',
  USER: 'USER',
  OBSERVATION: 'OBSERVATION',
  ROLE: 'ROLE',
} as const;
