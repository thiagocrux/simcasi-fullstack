import { clsx, type ClassValue } from 'clsx';
import { type ReactNode } from 'react';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

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
 * Returns the current browser's timezone offset in '+HH:mm', '-HH:mm' or 'Z' format.
 * Useful for syncing server-side date normalization with client-side local time.
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
