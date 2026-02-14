import * as z from 'zod';

import {
  USER_SEARCHABLE_FIELDS,
  USER_SORTABLE_FIELDS,
} from '@/core/domain/constants/user.constants';

import { messages } from '../messages';
import { regex } from '../regex';
import { createQuerySchema, UserEnrichmentFields } from './common.schema';

/**
 * Main schema for user entity validation.
 *
 * Defines all required fields for a user record, including name, email, password, and role.
 * Used for validating user creation, update, and form data throughout the application.
 */
export const userSchema = z.object({
  name: z.string().nonempty(messages.REQUIRED_FIELD('Nome')),
  email: z
    .email(messages.INVALID_FIELD('E-mail'))
    .nonempty(messages.REQUIRED_FIELD('E-mail')),
  password: z
    .string()
    .nonempty(messages.REQUIRED_FIELD('Senha'))
    .regex(regex.PASSWORD, messages.INVALID_PASSWORD),
  roleId: z
    .uuid(messages.INVALID_UUID)
    .nonempty(messages.REQUIRED_FIELD('Cargo')),
});

/**
 * Dynamic schema for user form (create/edit).
 *
 * - Allows password and password confirmation fields to be optional,
 *   since password is usually not changed in edit mode.
 * - Uses conditional validation via `.superRefine()` to ensure:
 *   - On creation: password and confirmation are required and must match.
 *   - On edit: password is only validated if provided, and confirmation is required if password is filled.
 *
 * This approach is necessary because the same form is used for both creating and editing users,
 * but the validation rules change depending on the context (creation vs. editing).
 */
export function getUserFormSchema(isEditMode: boolean) {
  return userSchema
    .extend({
      password: z.string().optional(),
      passwordConfirmation: z.string().optional(),
    })
    .superRefine((data, ctx) => {
      if (!isEditMode) {
        // Creation: password required
        if (!data.password || data.password.length < 6) {
          ctx.addIssue({
            path: ['password'],
            code: 'custom',
            message: messages.REQUIRED_MIN_LENGTH('Senha', 6),
          });
        }
        if (!data.passwordConfirmation) {
          ctx.addIssue({
            path: ['passwordConfirmation'],
            code: 'custom',
            message: messages.REQUIRED_FIELD('Confirmação de senha'),
          });
        }
        if (data.password !== data.passwordConfirmation) {
          ctx.addIssue({
            path: ['passwordConfirmation'],
            code: 'custom',
            message: messages.UNMATCHED_PASSWORDS,
          });
        }
      } else {
        // Edit: if password is filled, confirmation is required and must match
        if (data.password || data.passwordConfirmation) {
          if (!data.password || data.password.length < 6) {
            ctx.addIssue({
              path: ['password'],
              code: 'custom',
              message: messages.REQUIRED_MIN_LENGTH('Senha', 6),
            });
          }
          if (!data.passwordConfirmation) {
            ctx.addIssue({
              path: ['passwordConfirmation'],
              code: 'custom',
              message: messages.REQUIRED_FIELD('Confirmação de senha'),
            });
          }
          if (data.password !== data.passwordConfirmation) {
            ctx.addIssue({
              path: ['passwordConfirmation'],
              code: 'custom',
              message: messages.UNMATCHED_PASSWORDS,
            });
          }
        }
      }
    });
}

/**
 * Type for user creation.
 *
 * - Based on the main schema (`userSchema`), including all required fields for creation.
 * - Used in server actions, use cases, and repositories when creating a new user.
 */
export type CreateUserInput = z.infer<typeof userSchema>;

/**
 * Type for user update.
 *
 * - All user fields are optional (via `Partial`), allowing partial updates.
 * - Used in server actions, use cases, and repositories when updating an existing user.
 */
export type UpdateUserInput = Partial<z.infer<typeof userSchema>>;

/**
 * Type for user form usage.
 *
 * - We do not use `z.infer<typeof getUserFormSchema>` because the schema is dynamic (depends on isEditMode).
 * - Password fields are optional to allow the same type for both creation and editing.
 * - Ensures compatibility with React Hook Form and the schema's conditional validations.
 */
export type UserFormInput = {
  name: string;
  email: string;
  roleId: string;
  password?: string;
  passwordConfirmation?: string;
};

/**
 * Standardized query schema for listing users.
 *
 * Includes standard pagination, sorting, search, and fragments for:
 * - User enrichment (includeRelatedUsers)
 * - User specific filters (roleId)
 */
export const userQuerySchema = createQuerySchema(
  USER_SORTABLE_FIELDS,
  USER_SEARCHABLE_FIELDS
).extend({
  ...UserEnrichmentFields,
  roleId: z.uuid(messages.INVALID_UUID).optional(),
});

/**
 * Type for user list queries.
 * Used to type filters, pagination and search parameters.
 */
export type UserQueryInput = Partial<z.infer<typeof userQuerySchema>>;
