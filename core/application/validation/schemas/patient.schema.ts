import * as z from 'zod';

import {
  GENDER_OPTIONS,
  NATIONALITY_OPTIONS,
  RACE_OPTIONS,
  SCHOOLING_OPTIONS,
  SEX_OPTIONS,
  SEXUALITY_OPTIONS,
} from '@/core/domain/constants/patient.constants';
import { messages } from '../messages';
import { regex } from '../regex';

/**
 * Main schema for patient entity validation.
 *
 * Defines all required and optional fields for a patient record, including personal, demographic, and contact information.
 * Used for validating patient creation, update, and form data throughout the application.
 */
export const patientSchema = z.object({
  susCardNumber: z
    .string()
    .nonempty(messages.REQUIRED_FIELD('Número do cartão do SUS'))
    .regex(
      // Due to the use of mask, the length is 18 (15 numbers plus 3 whitespaces).
      regex.SUS_CARD_NUMBER,
      messages.REQUIRED_EXACT_LENGTH('Número do cartão do SUS', 18, 15)
    ),
  cpf: z
    .string()
    .nonempty(messages.REQUIRED_FIELD('CPF'))
    .regex(regex.CPF, messages.INVALID_FIELD('CPF')),
  name: z.string().nonempty(messages.REQUIRED_FIELD('Nome')),
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
  email: z
    .string()
    .optional()
    .refine((value) => !value || regex.EMAIL.test(value), {
      message: messages.INVALID_FIELD('E-mail'),
    }),
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

/**
 * Type for patient creation.
 *
 * - Based on the main schema (`patientSchema`), including all required fields for creation.
 * - Adds the `createdBy` field to track the author of the creation (auditing and control).
 * - Used in server actions, use cases, and repositories when creating a new patient.
 */
export type CreatePatientInput = z.infer<typeof patientSchema> & {
  createdBy: string;
};

/**
 * Type for patient update.
 *
 * - All patient fields are optional (via `Partial`), allowing partial updates.
 * - Adds the `updatedBy` field to track the author of the change (auditing and control).
 * - Used in server actions, use cases, and repositories when updating an existing patient.
 */
export type UpdatePatientInput = Partial<z.infer<typeof patientSchema>> & {
  updatedBy: string;
};

/**
 * Type for patient form usage.
 *
 * - Based on the main schema (`patientSchema`).
 * - Used to type patient creation/edit forms (e.g., with React Hook Form).
 */
export type PatientFormInput = z.infer<typeof patientSchema>;
