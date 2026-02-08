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
