import { useAppSelector } from './redux.hooks';

/**
 * Hook to check user permissions from the Redux store.
 * Provides granular authorization utilities for UI components.
 */
export function usePermission() {
  const { permissions, isAuthenticated } = useAppSelector(
    (state) => state.auth
  );

  /**
   * Checks if the user possesses a specific permission.
   * @param permissionCode The technical code of the permission (e.g., 'create:user').
   * @returns True if the user has the permission.
   */
  function can(permissionCode: string): boolean {
    return permissions.includes(permissionCode);
  }

  /**
   * Checks if the user has at least one of the provided permissions.
   * @param permissionCodes Array of technical permission codes.
   * @returns True if any permission is found.
   */
  function hasAny(permissionCodes: string[]): boolean {
    return permissionCodes.some((code: string) => permissions.includes(code));
  }

  /**
   * Checks if the user has all of the provided permissions.
   * @param permissionCodes Array of technical permission codes.
   * @returns True only if every permission is present.
   */
  function hasAll(permissionCodes: string[]): boolean {
    return permissionCodes.every((code: string) => permissions.includes(code));
  }

  return {
    can,
    hasAny,
    hasAll,
    isAuthenticated,
  };
}
