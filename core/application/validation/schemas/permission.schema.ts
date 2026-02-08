import { z } from 'zod';

import {
  PERMISSION_SEARCHABLE_FIELDS,
  PERMISSION_SORTABLE_FIELDS,
} from '@/core/domain/constants/permission.constants';

import { messages } from '../messages';
import { createQuerySchema, UserEnrichmentFields } from './common.schema';

/**
 * Main schema for permission entity validation.
 *
 * Defines all required and optional fields for a permission record, including code and associated roles.
 * Used for validating permission creation, update, and form data throughout the application.
 */
export const permissionSchema = z.object({
  code: z
    .string(messages.REQUIRED_FIELD('Código'))
    .min(2, messages.REQUIRED_MIN_LENGTH('Código', 2)),
  label: z
    .string(messages.REQUIRED_FIELD('Nome'))
    .min(2, messages.REQUIRED_MIN_LENGTH('Nome', 2)),
  /**
   * List of unique identifiers for roles to be associated with this permission.
   */
  roleIds: z.array(z.uuid()).optional(),
});
/**
 * Standardized query schema for listing permissions.
 *
 * Includes standard pagination, sorting, search, and fragments for:
 * - User enrichment (includeRelatedUsers)
 */
export const permissionQuerySchema = createQuerySchema(
  PERMISSION_SORTABLE_FIELDS,
  PERMISSION_SEARCHABLE_FIELDS
).extend({
  ...UserEnrichmentFields,
});

/**
 * Type for permission query input.
 *
 * Includes filters, pagination, and sorting for listing permissions.
 * Used in server actions and use cases.
 */
export type PermissionQueryInput = Partial<
  z.infer<typeof permissionQuerySchema>
>;
/**
 * Type for permission creation.
 *
 * - Based on the main schema (`permissionSchema`), including all required fields for creation.
 * - Used in server actions, use cases, and repositories when creating a new permission.
 */
export const CreatePermissionInputSchema = permissionSchema;
export type CreatePermissionInput = z.infer<typeof CreatePermissionInputSchema>;

/**
 * Type for permission update.
 *
 * - Based on the main schema (`permissionSchema`), including all fields (all optional if needed).
 * - Used in server actions, use cases, and repositories when updating an existing permission.
 */
export const UpdatePermissionInputSchema = permissionSchema;
export type UpdatePermissionInput = z.infer<typeof UpdatePermissionInputSchema>;

/**
 * Type for permission form usage.
 *
 * - Based on the main schema (`permissionSchema`).
 * - Used to type permission creation/edit forms (e.g., with React Hook Form).
 */
export type PermissionFormInput = z.infer<typeof permissionSchema>;
