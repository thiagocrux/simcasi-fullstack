import * as z from 'zod';

import {
  OBSERVATION_SEARCHABLE_FIELDS,
  OBSERVATION_SORTABLE_FIELDS,
} from '@/core/domain/constants/observation.constants';

import { messages } from '../messages';
import {
  createQuerySchema,
  PatientEnrichmentFields,
  PatientFilterFields,
  UserEnrichmentFields,
} from './common.schema';

/**
 * Main schema for observation entity validation.
 *
 * Defines all required and optional fields for an observation record, including patient, notes, and partner treatment status.
 * Used for validating observation creation, update, and form data throughout the application.
 */
export const observationSchema = z.object({
  patientId: z.string().nonempty(messages.REQUIRED_FIELD('Paciente')),
  observations: z.string().optional(),
  hasPartnerBeingTreated: z.boolean(),
});

/**
 * Standardized query schema for listing observations.
 *
 * Includes standard pagination, sorting, search, and fragments for:
 * - Patent filtering (patientId)
 * - Patient enrichment (includeRelatedPatients)
 * - User enrichment (includeRelatedUsers)
 */
export const observationQuerySchema = createQuerySchema(
  OBSERVATION_SORTABLE_FIELDS,
  OBSERVATION_SEARCHABLE_FIELDS
).extend({
  ...PatientFilterFields,
  ...PatientEnrichmentFields,
  ...UserEnrichmentFields,
});

/**
 * Type for observation list queries.
 * Used to type filters, pagination and search parameters.
 */
export type ObservationQueryInput = Partial<
  z.infer<typeof observationQuerySchema>
>;

/**
 * Type for observation creation.
 *
 * - Based on the main schema (`observationSchema`), including all required fields for creation.
 * - Adds the `createdBy` field to track the author of the creation (auditing and control).
 * - Used in server actions, use cases, and repositories when creating a new observation.
 */
export type CreateObservationInput = z.infer<typeof observationSchema> & {
  createdBy: string;
};

/**
 * Type for observation update.
 *
 * - All observation fields are optional (via `Partial`), allowing partial updates.
 * - Adds the `updatedBy` field to track the author of the change (auditing and control).
 * - Used in server actions, use cases, and repositories when updating an existing observation.
 */
export type UpdateObservationInput = Partial<
  z.infer<typeof observationSchema>
> & {
  updatedBy: string;
};

/**
 * Type for observation form usage.
 *
 * - Based on the main schema (`observationSchema`).
 * - Used to type observation creation/edit forms (e.g., with React Hook Form).
 */
export type ObservationFormInput = z.infer<typeof observationSchema>;
