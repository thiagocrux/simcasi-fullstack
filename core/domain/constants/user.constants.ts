/**
 * Fields of the User entity that are allowed for sorting in list requests.
 */
export const USER_SORTABLE_FIELDS = [
  'id',
  'name',
  'email',
  'phone',
  'enrollmentNumber',
  'professionalRegistration',
  'cpf',
  'workplace',
  'roleId',
  'isSystem',
  'createdBy',
  'createdAt',
  'updatedBy',
  'updatedAt',
  'deletedAt',
] as const;

/**
 * Fields of the User entity that are allowed for text search.
 */
export const USER_SEARCHABLE_FIELDS = [
  'name',
  'email',
  'cpf',
  'enrollmentNumber',
  'professionalRegistration',
] as const;
