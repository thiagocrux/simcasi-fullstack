import { redirect } from 'next/navigation';

/**
 * NotFound component that handles unmatched routes by redirecting to a localized not-found page.
 *
 * @remarks
 * The `return null;` line, although functionally unnecessary, is intentionally kept to prevent
 * a recurring error caused by a Turbopack bug.
 */
export default function NotFound() {
  redirect('/not-found');
  return null;
}
