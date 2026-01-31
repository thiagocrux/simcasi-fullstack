import { z } from 'zod';

import { messages } from '../messages';

/**
 * Main schema for role entity validation.
 *
 * Defines all required and optional fields for a role record, including code and associated permissions.
 * Used for validating role creation, update, and form data throughout the application.
 */
export const roleSchema = z.object({
  code: z
    .string(messages.REQUIRED_FIELD('Código'))
    .min(2, messages.REQUIRED_MIN_LENGTH('Código', 2)),
  /**
   * List of unique identifiers for permissions to be associated with this role.
   */
  permissionIds: z.array(z.uuid()).optional(),
});

/**
 * Type for role creation.
 *
 * - Based on the main schema (`roleSchema`), including all required fields for creation.
 * - Used in server actions, use cases, and repositories when creating a new role.
 */
export type CreateRoleInput = z.infer<typeof roleSchema>;

/**
 * Type for role update.
 *
 * - Based on the main schema (`roleSchema`), including all fields (all optional if needed).
 * - Used in server actions, use cases, and repositories when updating an existing role.
 */
export type UpdateRoleInput = z.infer<typeof roleSchema>;

/**
 * Type for role form usage.
 *
 * - Based on the main schema (`roleSchema`).
 * - Used to type role creation/edit forms (e.g., with React Hook Form).
 */
export type RoleFormInput = z.infer<typeof roleSchema>;
