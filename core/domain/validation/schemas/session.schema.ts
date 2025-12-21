import * as z from 'zod';

import { messages } from '../messages';
import { regex } from '../regex';

export const createSessionSchema = z.object({
  email: z.email('E-mail inválido.').nonempty('O e-mail é obrigatório.'),
  password: z
    .string()
    .nonempty(messages.REQUIRED_FIELD('senha'))
    .regex(regex.PASSWORD, messages.INVALID_PASSWORD),
});

export type CreateSessionInput = z.infer<typeof createSessionSchema>;

export const requestNewPasswordSchema = z.object({
  registeredEmail: z
    .email(messages.REQUIRED_FIELD('E-mail'))
    .nonempty(messages.REQUIRED_FIELD('E-mail')),
});

export type RequestNewPasswordInput = z.infer<typeof requestNewPasswordSchema>;

export const resetPasswordSchema = z.object({
  newPassword: z
    .string()
    .nonempty(messages.REQUIRED_FIELD('nova senha'))
    .regex(regex.PASSWORD, messages.INVALID_PASSWORD),
  newPasswordConfirmation: z
    .string()
    .nonempty(messages.REQUIRED_FIELD('confirmação de nova senha'))
    .regex(regex.PASSWORD, messages.INVALID_PASSWORD),
});

export type ResetPasswordInput = z.infer<typeof resetPasswordSchema>;
