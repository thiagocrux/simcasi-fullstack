/**
 * Canonical list of roles used by the database seed process (prisma/seed.ts).
 * Standardizes the user hierarchy within the SIMCASI ecosystem.
 *
 * NOTES:
 * - This constant initializes the database and is used by the seed script.
 * - It may also be referenced in production code where a simple static mapping is acceptable.
 *   However, the application should generally treat the database as the source of truth for roles
 *   at runtime (e.g. via useRole/findRoles).
 * - Each item contains:
 *   - code: technical identifier (used in DB and permission mappings)
 *   - label: human-friendly display text used by UI/seed (Portuguese labels)
 */
export const ROLES = [
  { code: 'admin', label: 'Administrador' },
  { code: 'user', label: 'Usuário' },
  { code: 'viewer', label: 'Leitor' },
];

/**
 * Fields of the Role entity that are allowed for sorting in list requests.
 */
export const ROLE_SORTABLE_FIELDS = [
  'id',
  'code',
  'label',
  'createdAt',
  'updatedAt',
] as const;

/**
 * Fields of the Role entity that are allowed for text search.
 */
export const ROLE_SEARCHABLE_FIELDS = ['code', 'label'] as const;
