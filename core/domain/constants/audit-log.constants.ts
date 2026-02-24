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
  'userId',
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
 * Labels in Portuguese for audit actions.
 */
export const ACTION_LABELS: Record<(typeof AUDIT_LOG_ACTIONS)[number], string> =
  {
    CREATE: 'Criação',
    UPDATE: 'Atualização',
    DELETE: 'Exclusão',
    RESTORE: 'Restauração',
    REVOKE_SESSION: 'Revogação de sessão',
    PASSWORD_CHANGE: 'Atualização de senha',
    PASSWORD_RESET: 'Redefinição de Senha',
    PASSWORD_RESET_REQUEST: 'Solicitação de redefinição de senha',
  };

/**
 * Labels in Portuguese for audit entities.
 */
export const ENTITY_LABELS: Record<string, string> = {
  EXAM: 'Exame',
  NOTIFICATION: 'Notificação',
  SESSION: 'Sessão',
  TREATMENT: 'Tratamento',
  PERMISSION: 'Permissão',
  PATIENT: 'Paciente',
  USER: 'Usuário',
  OBSERVATION: 'Observação',
  ROLE: 'Cargo',
  AUDIT_LOG: 'Log de auditoria',
};

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
