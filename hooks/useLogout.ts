import { useRouter } from 'next/navigation';

import { signOutUser } from '@/app/actions/session.actions';
import { useAppDispatch } from '@/hooks/redux.hooks';
import { logger } from '@/lib/logger.utils';
import { logout } from '@/stores/auth/auth.slice';

/**
 * Hook to handle user logout across client components.
 * Clears Redux state, deletes server cookies, and redirects to login.
 */
export function useLogout() {
  const router = useRouter();
  const dispatch = useAppDispatch();

  const handleLogout = async () => {
    logger.start('[CLIENT_LOGOUT] Initiating forced logout sequence...');

    // 1. Clear Redux state (client-side).
    logger.info('[CLIENT_LOGOUT] Clearing Redux state...');
    dispatch(logout());

    // 2. Clear cookies and server-side session.
    logger.info('[CLIENT_LOGOUT] Calling Server Action signOutUser...');
    try {
      await signOutUser();
      logger.success('[CLIENT_LOGOUT] signOutUser success.');
    } catch (error) {
      logger.error('[CLIENT_LOGOUT] signOutUser failed:', error);
    }

    // 3. Redirect to login page.
    logger.info('[CLIENT_LOGOUT] Redirecting to /auth/login...');
    router.push('/auth/login');
  };

  return { handleLogout };
}
