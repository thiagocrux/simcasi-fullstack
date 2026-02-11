/**
 * Fields of the User entity that are allowed for sorting in list requests.
 */
export const USER_SORTABLE_FIELDS = [
  'id',
  'name',
  'email',
  'roleId',
  'isSystem',
  'createdAt',
  'updatedAt',
  'deletedAt',
] as const;

/**
 * Fields of the User entity that are allowed for text search.
 * Only non-sensitive descriptors like name and email are searchable.
 */
export const USER_SEARCHABLE_FIELDS = ['name', 'email'] as const;
