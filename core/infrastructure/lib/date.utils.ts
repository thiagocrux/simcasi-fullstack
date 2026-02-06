/**
 * Normalizes a date string for use as a filter in Prisma queries,
 * respecting the provided timezone offset or defaulting to UTC.
 *
 * @param dateString The date string to normalize (e.g., '2026-02-01').
 * @param type Whether the date should represent the 'start' or 'end' of the day.
 * @param timezoneOffset The timezone offset (e.g., '-03:00', '+05:30', or 'Z').
 * @returns A Date object or undefined if the input is invalid.
 */
export function normalizeDateFilter(
  dateString?: string,
  type: 'start' | 'end' = 'start',
  timezoneOffset: string = 'Z'
): Date | undefined {
  if (!dateString) {
    return undefined;
  }

  // Extract the date part (yyyy-MM-dd) to handle various possible inputs.
  const match = dateString.match(/^(\d{4}-\d{2}-\d{2})/);
  if (!match) {
    return undefined;
  }

  const datePart = match[1];
  const time = type === 'start' ? 'T00:00:00' : 'T23:59:59.999';

  const normalizedDate = new Date(`${datePart}${time}${timezoneOffset}`);

  if (isNaN(normalizedDate.getTime())) {
    return undefined;
  }

  return normalizedDate;
}
