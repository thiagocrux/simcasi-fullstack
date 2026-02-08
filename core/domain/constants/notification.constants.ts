/**
 * Fields of the Notification entity that are allowed for sorting in list requests.
 */
export const NOTIFICATION_SORTABLE_FIELDS = [
  'id',
  'patientId',
  'sinan',
  'createdAt',
  'updatedAt',
  'deletedAt',
] as const;

/**
 * Fields of the Notification entity that are allowed for text search.
 */
export const NOTIFICATION_SEARCHABLE_FIELDS = [
  'sinan',
  'observations',
] as const;

/**
 * Miscellaneous constants related to notifications.
 */
export const SINAN_LENGTH = 7;
