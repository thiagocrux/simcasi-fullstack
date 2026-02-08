/**
 * Fields of the Session entity that are allowed for sorting in list requests.
 */
export const SESSION_SORTABLE_FIELDS = [
  'id',
  'userId',
  'issuedAt',
  'expiresAt',
  'createdAt',
  'updatedAt',
  'deletedAt',
] as const;

/**
 * Fields of the Session entity that are allowed for text search.
 */
export const SESSION_SEARCHABLE_FIELDS = ['ipAddress', 'userAgent'] as const;
