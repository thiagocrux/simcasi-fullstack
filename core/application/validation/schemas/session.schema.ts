import * as z from 'zod';

import {
  SESSION_SEARCHABLE_FIELDS,
  SESSION_SORTABLE_FIELDS,
} from '@/core/domain/constants/session.constants';

import { messages } from '../messages';
import { regex } from '../regex';
import {
  createQuerySchema,
  UserEnrichmentFields,
  UserFilterFields,
} from './common.schema';

/**
 * Main schema for session (login) validation.
 *
 * Defines all required fields for a login session, including email, password, and rememberMe flag.
 * Used for validating login forms and session creation throughout the application.
 */
export const sessionSchema = z.object({
  email: z.string().nonempty(messages.REQUIRED_FIELD('E-mail')),
  password: z.string().nonempty(messages.REQUIRED_FIELD('senha')),
  rememberMe: z.boolean(),
});

/**
 * Standardized query schema for listing sessions.
 *
 * Includes standard pagination, sorting, search, and fragments for:
 * - User filtering (userId)
 * - User enrichment (includeRelatedUsers)
 */
export const sessionQuerySchema = createQuerySchema(
  SESSION_SORTABLE_FIELDS,
  SESSION_SEARCHABLE_FIELDS
).extend({
  ...UserFilterFields,
  ...UserEnrichmentFields,
});

/**
 * Type for session query input.
 *
 * Includes filters, pagination, and sorting for listing sessions.
 * Used in server actions and use cases.
 */
export type SessionQueryInput = Partial<z.infer<typeof sessionQuerySchema>>;

/**
 * Type for session (login) form usage.
 *
 * - Based on the main schema (`sessionSchema`).
 * - Used to type login forms (e.g., with React Hook Form).
 */
export type SessionFormInput = z.infer<typeof sessionSchema>;

export type CreateSessionInput = z.infer<typeof sessionSchema>;

export const RequestPasswordResetSchema = z.object({
  registeredEmail: z
    .email(messages.REQUIRED_FIELD('E-mail'))
    .nonempty(messages.REQUIRED_FIELD('E-mail')),
});

export type RequestPasswordResetInput = z.infer<
  typeof RequestPasswordResetSchema
>;

export const resetPasswordSchema = z
  .object({
    token: z.string().nonempty(messages.REQUIRED_FIELD('Token')),
    newPassword: z
      .string()
      .nonempty(messages.REQUIRED_FIELD('Nova senha'))
      .regex(regex.PASSWORD, messages.INVALID_PASSWORD),
    newPasswordConfirmation: z
      .string()
      .nonempty(messages.REQUIRED_FIELD('Confirmação de nova senha')),
  })
  .superRefine((data, ctx) => {
    if (data.newPassword !== data.newPasswordConfirmation) {
      ctx.addIssue({
        code: 'custom',
        message: messages.UNMATCHED_PASSWORDS,
        path: ['newPasswordConfirmation'],
      });
    }
  });

export type ResetPasswordInput = z.infer<typeof resetPasswordSchema>;
