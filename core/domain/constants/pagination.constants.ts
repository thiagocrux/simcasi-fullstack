/**
 * Pagination constants for the application.
 * Standardizes how lists are returned across all system modules.
 */
export const PAGINATION = {
  /** The starting page number for paginated requests. */
  DEFAULT_PAGE: 1,
  /** The default number of items returned per page. */
  DEFAULT_LIMIT: 10,
  /** The maximum allowed limit for items per page to ensure performance. */
  MAX_LIMIT: 100,
} as const;
