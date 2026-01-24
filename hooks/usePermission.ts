import { useAppSelector } from './redux.hooks';

/**
 * Hook to check user permissions from the Redux store.
 */
export function usePermission() {
  const { permissions, isAuthenticated } = useAppSelector(
    (state) => state.auth
  );

  /**
   * Checks if the user has a specific permission.
   * @param permissionCode The code of the permission to check (e.g., 'READ_USER').
   */
  const can = (permissionCode: string) => {
    return permissions.includes(permissionCode);
  };

  /**
   * Checks if the user has at least one of the provided permissions.
   * @param permissionCodes The codes of the permissions to check.
   */
  const hasAny = (permissionCodes: string[]) => {
    return permissionCodes.some((code) => permissions.includes(code));
  };

  /**
   * Checks if the user has all of the provided permissions.
   * @param permissionCodes The codes of the permissions to check.
   */
  const hasAll = (permissionCodes: string[]) => {
    return permissionCodes.every((code) => permissions.includes(code));
  };

  return {
    can,
    hasAny,
    hasAll,
    isAuthenticated,
  };
}
