import { useRouter } from 'next/navigation';

import { logOutUser } from '@/app/actions/session.actions';
import { useAppDispatch } from '@/hooks/redux.hooks';
import { logger } from '@/lib/logger.utils';
import { clearCredentials } from '@/stores/slices/auth.slice';

/**
 * Hook to handle user logout across client components.
 * Clears Redux state, deletes server cookies, and redirects to login.
 * @return An object containing the logout handler.
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
    logger.start('Initiating logout sequence.', {
      action: 'user_logout_sequence',
    });

    // 1. Clear Redux state (client-side).
    logger.info('Clearing Redux credentials state.', {
      action: 'user_logout_sequence',
    });
    dispatch(clearCredentials());

    // 2. Clear cookies and server-side session.
    logger.info('Calling logOutUser server action.', {
      action: 'user_logout_sequence',
    });
    try {
      const response = await logOutUser();
      if (response.success) {
        logger.success('User session and cookies cleared successfully.', {
          action: 'user_logout_sequence',
        });
      } else {
        logger.error({
          action: 'user_logout_sequence',
          cause: 'logOutUser application error',
          error: response.error,
        });
      }
    } catch (error) {
      logger.error({
        action: 'user_logout_sequence',
        cause: 'logOutUser unexpected failure',
        error,
      });
    }

    // 3. Redirect to login page.
    logger.info('Redirecting to login page.', {
      action: 'user_logout_sequence',
    });
    router.push('/auth/login');
  }

  return { handleLogout };
}
