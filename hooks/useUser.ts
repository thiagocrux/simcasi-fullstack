import { useAppSelector } from './redux.hooks';

/**
 * Hook to retrieve user information and authentication state from the Redux store.
 * Provides access to the currently logged-in user and hydration flags.
 * @returns Object with user details and status flags.
 */
export function useUser() {
  const { user, roleCode, isAuthenticated, isHydrated } = useAppSelector(
    function selectAuthState(state) {
      return state.auth;
    }
  );

  /**
   * Indicates whether the authenticated user has the administrator role.
   * @returns `true` if the user's role code is 'admin', otherwise `false`.
   */
  const isUserAdmin = roleCode === 'admin';

  return {
    user,
    isUserAdmin,
    isAuthenticated,
    isHydrated,
  };
}
