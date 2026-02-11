/**
 * Permission constants used across the application to define granular access capabilities.
 * Follows a standard "action:entity" or "action" format.
 *
 * - `PERMISSIONS` is a canonical list of all permissions with code and human label.
 *   Example entry: { code: 'create:user', label: 'Criação de usuário' }.
 * - `PERMISSION_CODES` exposes the string codes for compatibility with mapping and search logic.
 *
 * IMPORTANT: The existence of a permission code represents a capability (e.g. `update:user`),
 * but business rules (for example, "a user may only update their own account") must be
 * enforced in the application or domain layer (use cases, services, policies), not solely
 * by checking permission strings.
 */
export const PERMISSIONS = [
  // Session
  { code: 'create:session', label: 'Criação de sessão' },
  { code: 'read:session', label: 'Leitura de sessão' },
  { code: 'update:session', label: 'Atualização de sessão' },
  { code: 'delete:session', label: 'Exclusão de sessão' },
  // Permission
  { code: 'create:permission', label: 'Criação de permissão' },
  { code: 'read:permission', label: 'Leitura de permissão' },
  { code: 'update:permission', label: 'Atualização de permissão' },
  { code: 'delete:permission', label: 'Exclusão de permissão' },
  // Role
  { code: 'create:role', label: 'Criação de cargo' },
  { code: 'read:role', label: 'Leitura de cargo' },
  { code: 'update:role', label: 'Atualização de cargo' },
  { code: 'delete:role', label: 'Exclusão de cargo' },
  // User
  { code: 'create:user', label: 'Criação de usuário' },
  { code: 'read:user', label: 'Leitura de usuário' },
  { code: 'update:user', label: 'Atualização de usuário' },
  { code: 'delete:user', label: 'Exclusão de usuário' },
  // Patient
  { code: 'create:patient', label: 'Criação de paciente' },
  { code: 'read:patient', label: 'Leitura de paciente' },
  { code: 'update:patient', label: 'Atualização de paciente' },
  { code: 'delete:patient', label: 'Exclusão de paciente' },
  // Treatment
  { code: 'create:treatment', label: 'Criação de tratamento' },
  { code: 'read:treatment', label: 'Leitura de tratamento' },
  { code: 'update:treatment', label: 'Atualização de tratamento' },
  { code: 'delete:treatment', label: 'Exclusão de tratamento' },
  // exam
  { code: 'create:exam', label: 'Criação de exame' },
  { code: 'read:exam', label: 'Leitura de exame' },
  { code: 'update:exam', label: 'Atualização de exame' },
  { code: 'delete:exam', label: 'Exclusão de exame' },
  // Notification
  { code: 'create:notification', label: 'Criação de notificação' },
  { code: 'read:notification', label: 'Leitura de notificação' },
  { code: 'update:notification', label: 'Atualização de notificação' },
  { code: 'delete:notification', label: 'Exclusão de notificação' },
  // Observation
  { code: 'create:observation', label: 'Criação de observação' },
  { code: 'read:observation', label: 'Leitura de observação' },
  { code: 'update:observation', label: 'Atualização de observação' },
  { code: 'delete:observation', label: 'Exclusão de observação' },
  // Audit-log
  { code: 'create:audit-log', label: 'Criação de registro de auditoria' },
  { code: 'read:audit-log', label: 'Leitura de registro de auditoria' },
] as const;

/**
 * Convenience array containing only permission codes for lookup and search operations.
 */
export const PERMISSION_CODES = PERMISSIONS.map(
  (p) => p.code
) as unknown as readonly string[];

/**
 * Hierarchical mapping of role code -> allowed permission codes for standard access control.
 *
 * Notes:
 * - `admin`: Receives all existing permissions across all modules.
 * - `user`: Broad permissions except for sensitive administrative actions (user creation, audit logs).
 * - `viewer`: Read-only access to clinical data; excluded from audit-log metadata visibility.
 */
export const PERMISSIONS_BY_ROLE: Record<string, readonly string[]> = {
  admin: [...PERMISSION_CODES],
  user: PERMISSION_CODES.filter(
    (permission) =>
      !['create:user', 'delete:user'].includes(permission) &&
      !permission.endsWith(':audit-log')
  ),
  viewer: PERMISSION_CODES.filter(
    (permission) =>
      permission.startsWith('read') && !permission.endsWith(':audit-log')
  ),
};

/**
 * Type guard that checks whether a value is a valid permission code.
 * @param value The raw string to validate.
 * @return True if the value is a defined permission code.
 */
export function isPermission(
  value: string
): value is (typeof PERMISSION_CODES)[number] {
  return PERMISSION_CODES.includes(value);
}

/**
 * Fields of the Permission entity that are allowed for sorting in list requests.
 */
export const PERMISSION_SORTABLE_FIELDS = [
  'id',
  'code',
  'label',
  'createdAt',
  'updatedAt',
] as const;

/**
 * Fields of the Permission entity that are allowed for text search.
 */
export const PERMISSION_SEARCHABLE_FIELDS = ['code', 'label'] as const;
