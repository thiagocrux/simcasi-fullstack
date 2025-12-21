import * as z from 'zod';

import { ROLE_OPTIONS } from '../../constants/role.constants';
import { messages } from '../messages';
import { regex } from '../regex';

export const createUserSchema = z.object({
  name: z.string().nonempty(messages.REQUIRED_FIELD('Nome')),
  email: z
    .email(messages.REQUIRED_FIELD('E-mail'))
    .nonempty(messages.REQUIRED_FIELD('E-mail')),
  password: z
    .string()
    .nonempty(messages.REQUIRED_FIELD('senha'))
    .regex(regex.PASSWORD, messages.INVALID_PASSWORD),
  role: z.enum(
    ROLE_OPTIONS.map((option) => option.value),
    messages.REQUIRED_FIELD('Cargo')
  ),
});

export type CreateUserInput = z.infer<typeof createUserSchema>;
export type UpdateUserInput = Partial<CreateUserInput>;
