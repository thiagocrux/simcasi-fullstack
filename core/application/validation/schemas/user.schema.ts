import * as z from 'zod';

import { ROLE_OPTIONS } from '@/core/domain/constants/role.constants';
import { messages } from '../messages';
import { regex } from '../regex';

export const userSchema = z.object({
  name: z.string().nonempty(messages.REQUIRED_FIELD('Nome')),
  email: z
    .email(messages.INVALID_FIELD('E-mail'))
    .nonempty(messages.REQUIRED_FIELD('E-mail')),
  password: z
    .string()
    .nonempty(messages.REQUIRED_FIELD('Senha'))
    .regex(regex.PASSWORD, messages.INVALID_PASSWORD),
  roleId: z.enum(
    ROLE_OPTIONS.map((option) => option.value) as [string, ...string[]],
    messages.REQUIRED_FIELD('Cargo')
  ),
});

export const userFormSchema = userSchema
  .extend({
    passwordConfirmation: z
      .string()
      .nonempty(messages.REQUIRED_FIELD('Confirmação de senha')),
  })
  .superRefine((data, ctx) => {
    if (data.password !== data.passwordConfirmation) {
      ctx.addIssue({
        code: 'custom',
        message: messages.UNMATCHED_PASSWORDS,
        path: ['passwordConfirmation'],
      });
    }
  });

export type CreateUserInput = z.infer<typeof userSchema>;
export type CreateUserFormInput = z.infer<typeof userFormSchema>;
export type UpdateUserInput = Partial<CreateUserInput>;
