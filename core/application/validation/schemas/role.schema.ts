import { z } from 'zod';

import { messages } from '../messages';

/**
 * Schema for role registration and update validation.
 * Used to ensure that roles have a valid code and optional permission links.
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
 * Type inferred from the role schema for creation.
 */
export type CreateRoleInputSchema = z.infer<typeof roleSchema>;

/**
 * Type inferred from the role schema for updates.
 */
export type UpdateRoleInputSchema = z.infer<typeof roleSchema>;
