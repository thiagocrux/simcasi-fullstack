import { useAppSelector } from './redux.hooks';

/**
 * Hook to retrieve user information from the Redux store.
 */
export function useUser() {
  const { user, isAuthenticated, isHydrated } = useAppSelector(
    (state) => state.auth
  );

  return {
    user,
    isAuthenticated,
    isHydrated,
  };
}
