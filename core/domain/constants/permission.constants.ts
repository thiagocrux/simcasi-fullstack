/**
 * Permission constants used across the application.
 *
 * - `PERMISSIONS` is a canonical list of all permission codes (format: `<action>:<resource>`),
 *   for example: `create:user`, `read:patient`.
 * - Use `PERMISSIONS_BY_ROLE` to map roles to the permissions they are granted.
 *
 * IMPORTANT: The existence of a permission code represents a capability (e.g. `update:user`),
 * but **business rules** (for example, "an user may only update their own account") must be
 * enforced in the application or domain layer (use cases, services, policies), not solely
 * by checking permission strings.
 */
export const PERMISSIONS = [
  // session
  'create:session',
  'read:session',
  'update:session',
  'delete:session',
  // permission
  'create:permission',
  'read:permission',
  'update:permission',
  'delete:permission',
  // role
  'create:role',
  'read:role',
  'update:role',
  'delete:role',
  // user
  'create:user',
  'read:user',
  'update:user',
  'delete:user',
  // patient
  'create:patient',
  'read:patient',
  'update:patient',
  'delete:patient',
  // treatment
  'create:treatment',
  'read:treatment',
  'update:treatment',
  'delete:treatment',
  // exam
  'create:exam',
  'read:exam',
  'update:exam',
  'delete:exam',
  // notification
  'create:notification',
  'read:notification',
  'update:notification',
  'delete:notification',
  // observation
  'create:observation',
  'read:observation',
  'update:observation',
  'delete:observation',
  // audit-log
  'create:audit-log',
  'read:audit-log',
];

/**
 * Mapping of role code -> allowed permission codes.
 *
 * Notes:
 * - `admin` receives all permissions.
 * - `user` receives the same permissions as `admin` **except** the ability to create/update/delete other
 *   users and all audit-log related permissions. The `update:user` permission for a `user` role must be
 *   interpreted as "update own account only" and enforced in the business logic (services/use-cases).
 * - `viewer` is intended to have read-only access.
 */
export const PERMISSIONS_BY_ROLE: Record<string, string[]> = {
  admin: [...PERMISSIONS],
  user: PERMISSIONS.filter(
    (permission) =>
      !['create:user', 'delete:user'].includes(permission) &&
      !permission.endsWith(':audit-log')
  ),
  viewer: PERMISSIONS.filter(
    (permission) =>
      permission.startsWith('read') && !permission.endsWith(':audit-log')
  ),
};

/**
 * Type guard that checks whether a value is a valid permission code defined in `PERMISSIONS`.
 *
 * Usage:
 * ```ts
 * if (isPermission(value)) {
 *   // `value` is now narrowed to a valid permission string
 * }
 * ```
 */
export function isPermission(
  value: string
): value is (typeof PERMISSIONS)[number] {
  return PERMISSIONS.includes(value);
}
