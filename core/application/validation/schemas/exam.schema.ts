import * as z from 'zod';

import {
  EXAM_SEARCHABLE_FIELDS,
  EXAM_SORTABLE_FIELDS,
} from '@/core/domain/constants/exam.constants';

import { messages } from '../messages';
import {
  createQuerySchema,
  PatientEnrichmentFields,
  PatientFilterFields,
  UserEnrichmentFields,
} from './common.schema';

/**
 * Main schema for exam entity validation.
 *
 * Defines all required and optional fields for an exam record, including test types, results, dates, and reference observations.
 * Used for validating exam creation, update, and form data throughout the application.
 */
export const examSchema = z.object({
  patientId: z
    .uuid(messages.INVALID_UUID)
    .nonempty(messages.REQUIRED_FIELD('Paciente')),
  treponemalTestType: z
    .string()
    .nonempty(messages.REQUIRED_FIELD('Tipo de teste treponêmico')),
  treponemalTestResult: z
    .string()
    .nonempty(messages.REQUIRED_FIELD('Resultado do teste treponêmico')),
  treponemalTestDate: z
    .string()
    .nonempty(messages.REQUIRED_FIELD('Data do teste treponêmico')),
  treponemalTestLocation: z
    .string()
    .nonempty(messages.REQUIRED_FIELD('Local do teste treponêmico')),
  nontreponemalVdrlTest: z
    .string()
    .nonempty(messages.REQUIRED_FIELD('Teste VDRL não treponêmico')),
  nontreponemalTestTitration: z
    .string()
    .nonempty(messages.REQUIRED_FIELD('Titulação do teste não treponêmico')),
  nontreponemalTestDate: z
    .string()
    .nonempty(messages.REQUIRED_FIELD('Data do teste não treponêmico')),
  otherNontreponemalTest: z.string().optional(),
  otherNontreponemalTestDate: z.string().optional(),
  referenceObservations: z
    .string()
    .nonempty(messages.REQUIRED_FIELD('Observações de referência')),
});

/**
 * Type for exam creation.
 *
 * - Based on the main schema (`examSchema`), including all required fields for creation.
 * - Adds the `createdBy` field to track the author of the creation (auditing and control).
 * - Used in server actions, use cases, and repositories when creating a new exam.
 */
export type CreateExamInput = z.infer<typeof examSchema> & {
  createdBy: string;
};

/**
 * Type for exam update.
 *
 * - All exam fields are optional (via `Partial`), allowing partial updates.
 * - Adds the `updatedBy` field to track the author of the change (auditing and control).
 * - Used in server actions, use cases, and repositories when updating an existing exam.
 */
export type UpdateExamInput = Partial<z.infer<typeof examSchema>> & {
  updatedBy: string;
};

/**
 * Type for exam form usage.
 *
 * - Based on the main schema (`examSchema`).
 * - Used to type exam creation/edit forms (e.g., with React Hook Form).
 */
export type ExamFormInput = z.infer<typeof examSchema>;

/**
 * Standardized query schema for listing exams.
 *
 * Includes standard pagination, sorting, search, and fragments for:
 * - Patent filtering (patientId)
 * - Patient enrichment (includeRelatedPatients)
 * - User enrichment (includeRelatedUsers)
 */
export const examQuerySchema = createQuerySchema(
  EXAM_SORTABLE_FIELDS,
  EXAM_SEARCHABLE_FIELDS
).extend({
  ...PatientFilterFields,
  ...PatientEnrichmentFields,
  ...UserEnrichmentFields,
});

/**
 * Type for exam list queries.
 * Used to type filters, pagination and search parameters.
 */
export type ExamQueryInput = Partial<z.infer<typeof examQuerySchema>>;
