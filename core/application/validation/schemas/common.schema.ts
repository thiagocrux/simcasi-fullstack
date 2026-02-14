import * as z from 'zod';

import { messages } from '../messages';

/**
 * Schema for validating UUID identifiers.
 *
 * Used to ensure that IDs passed to APIs or forms are valid UUIDs.
 */
export const IdSchema = z.uuid(messages.INVALID_UUID);

/**
 * Type for ID form usage.
 *
 * - Based on the main schema (`IdSchema`).
 * - Used to type forms or API params that require a UUID.
 */
export type IdFormInput = z.infer<typeof IdSchema>;

/**
 * Enrichment fields for patient-related data.
 */
export const PatientEnrichmentFields = {
  includeRelatedPatients: z.coerce.boolean().optional().default(false),
};

/**
 * Enrichment fields for user-related data.
 */
export const UserEnrichmentFields = {
  includeRelatedUsers: z.coerce.boolean().optional().default(false),
};

/**
 * Filter fields for patient-specific queries.
 */
export const PatientFilterFields = {
  patientId: z.uuid(messages.INVALID_UUID).optional(),
};

/**
 * Filter fields for user-specific queries.
 */
export const UserFilterFields = {
  userId: z.uuid(messages.INVALID_UUID).optional(),
};

/**
 * Main schema for paginated and filtered list requests.
 *
 * Defines all standard fields for pagination, sorting, searching, and date filtering in list endpoints.
 * Used for validating query params in list APIs and forms throughout the application.
 */
export function createQuerySchema(
  sortableFields: readonly string[] = [],
  searchableFields: readonly string[] = []
) {
  return z.object({
    skip: z.coerce.number().min(0).optional().default(0),
    take: z.coerce.number().min(1).max(100).optional().default(10),
    orderBy: z
      .string()
      .optional()
      .refine(
        (val) =>
          !val || sortableFields.length === 0 || sortableFields.includes(val),
        {
          message: `Campo de ordenação inválido. Campos válidos: ${sortableFields.join(
            ', '
          )}.`,
        }
      ),
    orderDir: z.enum(['asc', 'desc']).optional().default('asc'),
    search: z.string().optional(),
    searchBy: z
      .string()
      .optional()
      .refine(
        (val) =>
          !val ||
          searchableFields.length === 0 ||
          searchableFields.includes(val),
        {
          message: `Campo de pesquisa inválido. Campos válidos: ${searchableFields.join(
            ', '
          )}.`,
        }
      ),
    startDate: z.string().optional(),
    endDate: z.string().optional(),
    timezoneOffset: z.string().optional(),
    includeDeleted: z.coerce.boolean().optional().default(false),
  });
}

export const QuerySchema = createQuerySchema();

/**
 * Type for query form usage.
 *
 * - Based on the main schema (`QuerySchema`).
 * - Used to type paginated/filter form inputs or API query params.
 */
export type QueryFormInput = Partial<z.infer<typeof QuerySchema>>;

export type QueryInput = Partial<z.infer<typeof QuerySchema>>;
