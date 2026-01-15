import * as z from 'zod';

import { messages } from '../messages';
import { regex } from '../regex';

import {
  GENDER_OPTIONS,
  NATIONALITY_OPTIONS,
  RACE_OPTIONS,
  SCHOOLING_OPTIONS,
  SEX_OPTIONS,
  SEXUALITY_OPTIONS,
} from '@/core/domain/constants/patient.constants';

export const patientSchema = z.object({
  susCardNumber: z
    .string()
    .nonempty(messages.REQUIRED_FIELD('Número do cartão do SUS'))
    .regex(
      /\d{15}/g,
      messages.REQUIRED_MIN_LENGTH('Número do cartão do SUS', 15)
    ),
  name: z.string().nonempty(messages.REQUIRED_FIELD('Nome')),
  cpf: z
    .string()
    .nonempty(messages.REQUIRED_FIELD('CPF'))
    .regex(regex.CPF, messages.INVALID_FIELD('CPF')),
  socialName: z.string().optional(),
  birthDate: z.string().nonempty(messages.REQUIRED_FIELD('Data de nascimento')),
  race: z.enum(
    RACE_OPTIONS.map((option) => option.value),
    messages.REQUIRED_FIELD('Raça')
  ),
  sex: z.enum(
    SEX_OPTIONS.map((option) => option.value),
    messages.REQUIRED_FIELD('Sexo')
  ),
  gender: z.enum(
    GENDER_OPTIONS.map((option) => option.value),
    messages.REQUIRED_FIELD('Gênero')
  ),
  sexuality: z.enum(
    SEXUALITY_OPTIONS.map((option) => option.value),
    messages.REQUIRED_FIELD('Sexualidade')
  ),
  nationality: z.enum(
    NATIONALITY_OPTIONS.map((option) => option.value),
    messages.REQUIRED_FIELD('Nacionalidade')
  ),
  schooling: z.enum(
    SCHOOLING_OPTIONS.map((option) => option.value),
    messages.REQUIRED_FIELD('Escolaridade')
  ),
  phone: z
    .string()
    .optional()
    .refine((value) => !value || regex.PHONE.test(value), {
      message: messages.INVALID_PHONE,
    }),
  email: z.string().optional(),
  motherName: z.string().nonempty(messages.REQUIRED_FIELD('Nome da mãe')),
  fatherName: z.string().optional(),
  isDeceased: z.boolean(),
  monitoringType: z
    .string()
    .nonempty(messages.REQUIRED_FIELD('Tipo de monitoramento')),
  zipCode: z.string().optional(),
  state: z.string().nonempty(messages.REQUIRED_FIELD('Estado')),
  city: z.string().nonempty(messages.REQUIRED_FIELD('Cidade')),
  neighborhood: z.string().nonempty(messages.REQUIRED_FIELD('Bairro')),
  street: z.string().nonempty(messages.REQUIRED_FIELD('Rua')),
  houseNumber: z.string().nonempty(messages.REQUIRED_FIELD('Número da casa')),
  complement: z.string().optional(),
});

export type CreatePatientInput = z.infer<typeof patientSchema>;
export type UpdatePatientInput = Partial<CreatePatientInput>;
