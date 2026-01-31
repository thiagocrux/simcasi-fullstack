import * as z from 'zod';

import { messages } from '../messages';
import { regex } from '../regex';

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
 * Type for session (login) form usage.
 *
 * - Based on the main schema (`sessionSchema`).
 * - Used to type login forms (e.g., with React Hook Form).
 */
export type SessionFormInput = z.infer<typeof sessionSchema>;

export type CreateSessionInput = z.infer<typeof sessionSchema>;

export const requestNewPasswordSchema = z.object({
  registeredEmail: z
    .email(messages.REQUIRED_FIELD('E-mail'))
    .nonempty(messages.REQUIRED_FIELD('E-mail')),
});

export type RequestNewPasswordInput = z.infer<typeof requestNewPasswordSchema>;

export const resetPasswordSchema = z
  .object({
    newPassword: z.string().nonempty(messages.REQUIRED_FIELD('nova senha')),
    newPasswordConfirmation: z
      .string()
      .nonempty(messages.REQUIRED_FIELD('confirmação de nova senha')),
  })
  .superRefine((data, ctx) => {
    if (!regex.PASSWORD.test(data.newPassword)) {
      ctx.addIssue({
        code: 'custom',
        message: messages.INVALID_PASSWORD,
        path: ['password'],
      });
    }

    if (data.newPassword !== data.newPasswordConfirmation) {
      ctx.addIssue({
        code: 'custom',
        message: messages.UNMATCHED_PASSWORDS,
        path: ['passwordConfirmation'],
      });
    }
  });

export type ResetPasswordInput = z.infer<typeof resetPasswordSchema>;
