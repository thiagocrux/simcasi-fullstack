import { z } from 'zod';

import { messages } from '../messages';

/**
 * Schema for permission registration and update validation.
 * Used to ensure that permissions have a valid code and optional role links.
 */
export const permissionSchema = z.object({
  code: z
    .string(messages.REQUIRED_FIELD('Código'))
    .min(2, messages.REQUIRED_MIN_LENGTH('Código', 2)),
  /**
   * List of unique identifiers for roles to be associated with this permission.
   */
  roleIds: z.array(z.uuid()).optional(),
});

/**
 * Type inferred from the permission schema for creation.
 */
export type CreatePermissionInputSchema = z.infer<typeof permissionSchema>;

/**
 * Type inferred from the permission schema for updates.
 */
export type UpdatePermissionInputSchema = z.infer<typeof permissionSchema>;
