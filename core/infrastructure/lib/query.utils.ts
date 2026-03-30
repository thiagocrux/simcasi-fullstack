import { normalizeDateFilter } from './date.utils';

/**
 * Builds a Prisma-compatible date range filter for the `createdAt` field.
 *
 * @param startDate The start date string (e.g., '2026-01-01').
 * @param endDate The end date string (e.g., '2026-12-31').
 * @param timezoneOffset The timezone offset (e.g., '-03:00', '+05:30', or 'Z').
 * @return An object with gte/lte Date values, or undefined if neither date is provided.
 */
export function buildDateRangeFilter(
  startDate?: string,
  endDate?: string,
  timezoneOffset?: string
): { gte?: Date; lte?: Date } | undefined {
  const start = normalizeDateFilter(startDate, 'start', timezoneOffset);
  const end = normalizeDateFilter(endDate, 'end', timezoneOffset);

  if (!start && !end) return undefined;

  return { gte: start, lte: end };
}

/**
 * Builds a Prisma-compatible orderBy array.
 *
 * Handles 'createdBy' and 'updatedBy' as virtual sortable fields that map to the
 * nested `creator`/`updater` relationships, allowing sorting by the related user's name.
 * Falls back to `createdAt` descending when no orderBy field is supplied.
 *
 * @param orderBy The field to sort by.
 * @param orderDir The sort direction.
 * @return A Prisma-compatible orderBy array.
 */
export function buildOrderByClause(
  orderBy?: string,
  orderDir: 'asc' | 'desc' = 'asc'
) {
  if (!orderBy) return [{ createdAt: 'desc' as const }];

  if (orderBy === 'createdBy') {
    return [{ creator: { name: orderDir } }, { createdAt: 'desc' as const }];
  }

  if (orderBy === 'updatedBy') {
    return [{ updater: { name: orderDir } }, { createdAt: 'desc' as const }];
  }

  return [{ [orderBy]: orderDir }, { createdAt: 'desc' as const }];
}
