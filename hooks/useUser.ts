import { useAppSelector } from './redux.hooks';

/**
 * Hook to retrieve user information and authentication state from the Redux store.
 * Provides access to the currently logged-in user and hydration flags.
 * @return Object with user details and status flags.
 */
export function useUser() {
  const { user, roleCode, isAuthenticated, isHydrated } = useAppSelector(
    function selectAuthState(state) {
      return state.auth;
    }
  );

  /**
   * Indicates whether the authenticated user has the administrator role.
   * @return `true` if the user's role code is 'admin', otherwise `false`.
   */
  const isUserAdmin = roleCode === 'admin';

  /**
   * Indicates whether the authenticated user has the health professional role.
   * @return `true` if the user's role code is 'user' (internal code for health professional), otherwise `false`.
   */
  const isHealthProfessional = roleCode === 'user';

  /**
   * Indicates whether the authenticated user has the read-only viewer role.
   * @return `true` if the user's role code is 'viewer', otherwise `false`.
   */
  const isUserViewer = roleCode === 'viewer';

  return {
    user,
    isUserAdmin,
    isHealthProfessional,
    isUserViewer,
    isAuthenticated,
    isHydrated,
  };
}
