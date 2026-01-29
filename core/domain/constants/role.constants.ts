/**
 * Canonical list of roles used by the database seed process (prisma/seed.ts).
 *
 * NOTES:
 * - This constant initializes the database and is used by the seed script.
 * - It may also be referenced in production code where a simple static mapping is acceptable.
 *   However, the application should generally treat the database as the source of truth for roles
 *   at runtime (e.g. via useRole/findRoles).
 * - Each item contains:
 *   - code: technical identifier (used in DB and permission mappings)
 *   - label: human-friendly display text used by UI/seed
 */
export const ROLES = [
  { code: 'admin', label: 'Administrador' },
  { code: 'user', label: 'Usuário' },
  { code: 'viewer', label: 'Leitor' },
];
