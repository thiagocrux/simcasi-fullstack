import { z } from 'zod';

import {
  ROLE_SEARCHABLE_FIELDS,
  ROLE_SORTABLE_FIELDS,
} from '@/core/domain/constants/role.constants';

import { messages } from '../messages';
import { createQuerySchema, UserEnrichmentFields } from './common.schema';

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
  label: z
    .string(messages.REQUIRED_FIELD('Nome'))
    .min(2, messages.REQUIRED_MIN_LENGTH('Nome', 2)),
  /**
   * List of unique identifiers for permissions to be associated with this role.
   */
  permissionIds: z.array(z.uuid()).optional(),
});
/**
 * Standardized query schema for listing roles.
 *
 * Includes standard pagination, sorting, search, and fragments for:
 * - User enrichment (includeRelatedUsers)
 */
export const roleQuerySchema = createQuerySchema(
  ROLE_SORTABLE_FIELDS,
  ROLE_SEARCHABLE_FIELDS
).extend({
  ...UserEnrichmentFields,
});

/**
 * Type for role query input.
 *
 * Includes filters, pagination, and sorting for listing roles.
 * Used in server actions and use cases.
 */
export type RoleQueryInput = Partial<z.infer<typeof roleQuerySchema>>;
/**
 * Type for role creation.
 *
 * - Based on the main schema (`roleSchema`), including all required fields for creation.
 * - Used in server actions, use cases, and repositories when creating a new role.
 */
export const CreateRoleInputSchema = roleSchema;
export type CreateRoleInput = z.infer<typeof CreateRoleInputSchema>;

/**
 * Type for role update.
 *
 * - Based on the main schema (`roleSchema`), including all fields (all optional if needed).
 * - Used in server actions, use cases, and repositories when updating an existing role.
 */
export const UpdateRoleInputSchema = roleSchema;
export type UpdateRoleInput = z.infer<typeof UpdateRoleInputSchema>;

/**
 * Type for role form usage.
 *
 * - Based on the main schema (`roleSchema`).
 * - Used to type role creation/edit forms (e.g., with React Hook Form).
 */
export type RoleFormInput = z.infer<typeof roleSchema>;
