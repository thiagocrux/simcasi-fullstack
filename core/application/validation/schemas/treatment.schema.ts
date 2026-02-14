import * as z from 'zod';

import {
  TREATMENT_SEARCHABLE_FIELDS,
  TREATMENT_SORTABLE_FIELDS,
} from '@/core/domain/constants/treatment.constants';

import { messages } from '../messages';
import {
  createQuerySchema,
  PatientEnrichmentFields,
  PatientFilterFields,
  UserEnrichmentFields,
} from './common.schema';

/**
 * Main schema for treatment entity validation.
 *
 * Defines all required and optional fields for a treatment record, including medication, health center, dates, and partner information.
 * Used for validating treatment creation, update, and form data throughout the application.
 */
export const treatmentSchema = z.object({
  patientId: z
    .uuid(messages.INVALID_UUID)
    .nonempty(messages.REQUIRED_FIELD('Paciente')),
  medication: z.string().nonempty(messages.REQUIRED_FIELD('Medicação')),
  healthCenter: z
    .string()
    .nonempty(messages.REQUIRED_FIELD('Unidade Básica de Saúde')),
  startDate: z.string().nonempty(messages.REQUIRED_FIELD('Data de início')),
  dosage: z.string().nonempty(messages.REQUIRED_FIELD('Dosagem')),
  observations: z.string().optional(),
  partnerInformation: z.string().optional(),
});

/**
 * Standardized query schema for listing treatments.
 *
 * Includes standard pagination, sorting, search, and fragments for:
 * - Patent filtering (patientId)
 * - Patient enrichment (includeRelatedPatients)
 * - User enrichment (includeRelatedUsers)
 */
export const treatmentQuerySchema = createQuerySchema(
  TREATMENT_SORTABLE_FIELDS,
  TREATMENT_SEARCHABLE_FIELDS
).extend({
  ...PatientFilterFields,
  ...PatientEnrichmentFields,
  ...UserEnrichmentFields,
});

/**
 * Type for treatment query input.
 *
 * Includes filters, pagination, and sorting for listing treatments.
 * Used in server actions and use cases.
 */
export type TreatmentQueryInput = Partial<z.infer<typeof treatmentQuerySchema>>;

/**
 * Type for treatment creation.
 *
 * - Based on the main schema (`treatmentSchema`), including all required fields for creation.
 * - Adds the `createdBy` field to track the author of the creation (auditing and control).
 * - Used in server actions, use cases, and repositories when creating a new treatment.
 */
export type CreateTreatmentInput = z.infer<typeof treatmentSchema> & {
  createdBy: string;
};

/**
 * Type for treatment update.
 *
 * - All treatment fields are optional (via `Partial`), allowing partial updates.
 * - Adds the `updatedBy` field to track the author of the change (auditing and control).
 * - Used in server actions, use cases, and repositories when updating an existing treatment.
 */
export type UpdateTreatmentInput = Partial<z.infer<typeof treatmentSchema>> & {
  updatedBy: string;
};

/**
 * Type for treatment form usage.
 *
 * - Based on the main schema (`treatmentSchema`).
 * - Used to type treatment creation/edit forms (e.g., with React Hook Form).
 */
export type TreatmentFormInput = z.infer<typeof treatmentSchema>;
