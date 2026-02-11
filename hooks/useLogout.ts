import { useRouter } from 'next/navigation';

import { signOutUser } from '@/app/actions/session.actions';
import { useAppDispatch } from '@/hooks/redux.hooks';
import { logger } from '@/lib/logger.utils';
import { clearCredentials } from '@/stores/auth/auth.slice';

/**
 * Hook to handle user logout across client components.
 * Clears Redux state, deletes server cookies, and redirects to login.
 * @returns An object containing the logout handler.
 */
export function useLogout() {
  const router = useRouter();
  const dispatch = useAppDispatch();

  /**
   * Orchestrates the logout sequence.
   * 1. Clears Redux credentials.
   * 2. Calls the server-side sign out action.
   * 3. Redirects the user to the login page.
   */
  async function handleLogout(): Promise<void> {
    logger.start('[CLIENT_LOGOUT] Initiating forced logout sequence...');

    // 1. Clear Redux state (client-side).
    logger.info('[CLIENT_LOGOUT] Clearing Redux state...');
    dispatch(clearCredentials());

    // 2. Clear cookies and server-side session.
    logger.info('[CLIENT_LOGOUT] Calling Server Action signOutUser...');
    try {
      const response = await signOutUser();
      if (response.success) {
        logger.success('[CLIENT_LOGOUT] signOutUser success.');
      } else {
        logger.error(
          '[CLIENT_LOGOUT] signOutUser logic failed:',
          response.error
        );
      }
    } catch (error) {
      logger.error('[CLIENT_LOGOUT] signOutUser unexpected failure:', error);
    }

    // 3. Redirect to login page.
    logger.info('[CLIENT_LOGOUT] Redirecting to /auth/sign-in...');
    router.push('/auth/sign-in');
  }

  return { handleLogout };
}
