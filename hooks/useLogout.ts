import { useRouter } from 'next/navigation';

import { signOutUser } from '@/app/actions/session.actions';
import { useAppDispatch } from '@/hooks/redux.hooks';
import { logout } from '@/stores/auth/auth.slice';

/**
 * Hook to handle user logout across client components.
 * Clears Redux state, deletes server cookies, and redirects to login.
 */
export function useLogout() {
  const router = useRouter();
  const dispatch = useAppDispatch();

  const handleLogout = async () => {
    // 1. Clear Redux state (client-side).
    dispatch(logout());

    // 2. Clear cookies and server-side session.
    await signOutUser();

    // 3. Redirect to login page.
    router.push('/auth/login');
  };

  return { handleLogout };
}
