import * as z from 'zod';

import { messages } from '../messages';

export const IdSchema = z.uuid(messages.INVALID_UUID);

/**
 * Standard schema for paginated and filtered list requests.
 */
export const QuerySchema = z.object({
  skip: z.coerce.number().min(0).optional().default(0),
  take: z.coerce.number().min(1).max(100).optional().default(10),
  orderBy: z.string().optional(),
  orderDir: z.enum(['asc', 'desc']).optional().default('asc'),
  search: z.string().optional(),
  includeDeleted: z.coerce.boolean().optional().default(false),
  startDate: z.coerce.date().optional(),
  endDate: z.coerce.date().optional(),
});

export type QueryInput = z.infer<typeof QuerySchema>;
