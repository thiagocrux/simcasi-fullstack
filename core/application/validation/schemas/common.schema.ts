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
 * Main schema for paginated and filtered list requests.
 *
 * Defines all standard fields for pagination, sorting, searching, and date filtering in list endpoints.
 * Used for validating query params in list APIs and forms throughout the application.
 */
export const QuerySchema = z.object({
  skip: z.coerce.number().min(0).optional().default(0),
  take: z.coerce.number().min(1).max(100).optional().default(10),
  orderBy: z.string().optional(),
  orderDir: z.enum(['asc', 'desc']).optional().default('asc'),
  search: z.string().optional(),
  searchBy: z.string().optional(),
  startDate: z.coerce.date().optional(),
  endDate: z.coerce.date().optional(),
  includeDeleted: z.coerce.boolean().optional().default(false),
});

/**
 * Type for query form usage.
 *
 * - Based on the main schema (`QuerySchema`).
 * - Used to type paginated/filter form inputs or API query params.
 */
export type QueryFormInput = Partial<z.infer<typeof QuerySchema>>;

export type QueryInput = Partial<z.infer<typeof QuerySchema>>;
