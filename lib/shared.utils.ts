import { clsx, type ClassValue } from 'clsx';
import { type ReactNode } from 'react';
import { twMerge } from 'tailwind-merge';

import { Patient } from '@/core/domain/entities/patient.entity';
import { User } from '@/core/domain/entities/user.entity';

/**
 * Merges and deduplicates Tailwind CSS class names and custom classes.
 *
 * Useful for conditionally combining class names in React components.
 *
 * @param {...ClassValue[]} inputs List of class values to merge.
 * @returns {string} The merged class string.
 * @example
 * cn('p-2', isActive && 'bg-blue-500', 'rounded') // 'p-2 bg-blue-500 rounded'
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Generates a pagination range for displaying page numbers with optional ellipsis.
 *
 * Useful for paginated tables or lists, showing a concise set of page numbers around the current page.
 *
 * @param {number} currentPage The current active page (1-based).
 * @param {number} totalPages The total number of pages.
 * @param {number=} siblingCount Number of pages to show on each side of the current page. Default is 1.
 * @returns {Array<number|string>} Array of page numbers and/or ellipsis ('...').
 * @example
 * getPaginationRange(5, 10, 1) // [1, '...', 4, 5, 6, '...', 10]
 */
export function getPaginationRange(
  currentPage: number,
  totalPages: number,
  siblingCount = 1
) {
  const totalPageNumbers = siblingCount + 5;

  if (totalPageNumbers >= totalPages) {
    return Array.from({ length: totalPages }, (_, index) => index + 1);
  }

  const leftSiblingIndex = Math.max(currentPage - siblingCount, 1);
  const rightSiblingIndex = Math.min(currentPage + siblingCount, totalPages);

  const shouldShowLeftDots = leftSiblingIndex > 2;
  const shouldShowRightDots = rightSiblingIndex < totalPages - 2;

  const firstPageIndex = 1;
  const lastPageIndex = totalPages;

  if (!shouldShowLeftDots && shouldShowRightDots) {
    const leftItemCount = 3 + 2 * siblingCount;
    const leftRange = Array.from(
      { length: leftItemCount },
      (_, index) => index + 1
    );
    return [...leftRange, '...', totalPages];
  }

  if (shouldShowLeftDots && !shouldShowRightDots) {
    const rightItemCount = 3 + 2 * siblingCount;
    const rightRange = Array.from(
      { length: rightItemCount },
      (_, index) => totalPages - rightItemCount + index + 1
    );
    return [firstPageIndex, '...', ...rightRange];
  }

  if (shouldShowLeftDots && shouldShowRightDots) {
    const middleRange = Array.from(
      { length: rightSiblingIndex - leftSiblingIndex + 1 },
      (_, index) => leftSiblingIndex + index
    );
    return [firstPageIndex, '...', ...middleRange, '...', lastPageIndex];
  }

  return [];
}

/**
 * Renders a value using a custom renderer or returns a fallback if the value is empty.
 *
 * Useful for table cells or UI elements where a value may be missing or undefined.
 *
 * @param {unknown} value The value to render.
 * @param {function(string): ReactNode} renderer Function to render the value as a React node.
 * @param {ReactNode=} fallback Fallback node to display if value is empty. Default is '-'.
 * @returns {ReactNode} Rendered node or fallback.
 * @example
 * renderOrFallback(user.name, (name) => <span>{name}</span>)
 */
export function renderOrFallback(
  value: unknown,
  renderer: (value: string) => ReactNode,
  fallback: ReactNode = '-'
): ReactNode {
  if (value === undefined || value === null || value === '') {
    return fallback;
  }
  return renderer(String(value));
}

/**
 * Gets the current browser's timezone offset in '+HH:mm', '-HH:mm', or 'Z' format.
 *
 * Useful for synchronizing server-side date normalization with client-side local time.
 *
 * @returns {string} The timezone offset string.
 * @example
 * getTimezoneOffset() // '+03:00', '-02:00', or 'Z'
 */
export function getTimezoneOffset(): string {
  const offsetMinutes = new Date().getTimezoneOffset();
  if (offsetMinutes === 0) {
    return 'Z';
  }
  const offsetHours = Math.abs(Math.floor(offsetMinutes / 60))
    .toString()
    .padStart(2, '0');
  const offsetMins = Math.abs(offsetMinutes % 60)
    .toString()
    .padStart(2, '0');
  const sign = offsetMinutes > 0 ? '-' : '+';
  return `${sign}${offsetHours}:${offsetMins}`;
}

/**
 * Finds and returns an entity (user or patient) by its ID.
 *
 * Mainly used to display detailed information in tables, replacing the technical ID
 * with relevant data from the associated user or patient. Commonly applied to fields
 * like `createdBy`, `updatedBy`, and `patient`, this utility allows you to quickly
 * retrieve the full object to render names, emails, or other details instead of just
 * the identifier.
 *
 * @param {User[]|Patient[]} relatedRecords List of related entities (users or patients).
 * @param {string} id Unique identifier of the entity to find.
 * @returns {User|Patient|undefined} The entity matching the given ID, or `undefined` if not found.
 * @example
 * // Example: show creator's name in a table
 * const creator = findRecordById(relatedUsers, patient.createdBy);
 * return creator ? creator.name : '-';
 */
export function findRecordById(
  relatedRecords: Omit<User, 'password'>[] | Patient[],
  id: string
) {
  return relatedRecords?.find((record) => record.id === id);
}
