import { useAppSelector } from './redux.hooks';

/**
 * Hook to retrieve user information and authentication state from the Redux store.
 * Provides access to the currently logged-in user and hydration flags.
 * @returns Object with user details and status flags.
 */
export function useUser() {
  const { user, isAuthenticated, isHydrated } = useAppSelector(
    function selectAuthState(state) {
      return state.auth;
    }
  );

  return {
    user,
    isAuthenticated,
    isHydrated,
  };
}
