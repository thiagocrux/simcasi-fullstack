import * as z from 'zod';

import { messages } from '../messages';
import { regex } from '../regex';

export const sessionSchema = z.object({
  email: z.string().nonempty(messages.REQUIRED_FIELD('E-mail')),
  password: z.string().nonempty(messages.REQUIRED_FIELD('senha')),
  rememberMe: z.boolean(),
});

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
