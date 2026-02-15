/**
 * Utility type for cyclic sorting in TanStack tables.
 * @typedef {'asc' | 'desc' | false} SortDirection
 */
export type SortDirection = 'asc' | 'desc' | false;

/**
 * Returns the next cyclic sort state: asc -> desc -> false (reset).
 *
 * @param {SortDirection} current - The current sort direction.
 * @return {SortDirection} The next sort direction in the cycle.
 */
export function getNextSortDirection(current: SortDirection): SortDirection {
  if (current === 'asc') return 'desc';
  if (current === 'desc') return false;
  return 'asc';
}
