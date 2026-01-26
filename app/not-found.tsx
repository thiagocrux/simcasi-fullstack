import { redirect } from 'next/navigation';

/**
 * NotFound component that handles unmatched routes by redirecting to a localized not-found page.
 */
export default function NotFound() {
  redirect('/not-found');
}
