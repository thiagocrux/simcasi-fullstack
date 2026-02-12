import { useCallback, useMemo } from 'react';

import { useQuery } from '@tanstack/react-query';

import { findRoles } from '@/app/actions/role.actions';
import { Role } from '@/core/domain/entities/role.entity';

/**
 * Hook to manage role-related operations and state.
 * Fetches roles from the server and provides utility functions for display.
 * @returns An object containing the roles list, display utilities, and loading state.
 */
export function useRole() {
  /**
   * Shared query to fetch the roles list from the server.
   * Caches results for 1 hour to minimize infrastructure overhead.
   */
  const { data: response, isLoading: isLoadingRoles } = useQuery({
    queryKey: ['find-roles'],
    queryFn: async function fetchRoles() {
      return findRoles({ take: 100, includeDeleted: true });
    },
    staleTime: 1000 * 60 * 60,
  });

  /**
   * Memoized list of roles extracted from the API response.
   * Defaults to an empty array if the request is pending or failed.
   */
  const roles = useMemo(
    function computeRoles() {
      return response?.success ? response.data.items : [];
    },
    [response]
  );

  /**
   * Translates a role ID into its human-readable label.
   * @param roleId The unique identifier of the role.
   * @returns The label of the role, 'Carregando...', or 'Desconhecido'.
   */
  const getRoleLabel = useCallback(
    function getLabel(roleId: string | null): string | null {
      if (!roleId) {
        return null;
      }
      if (isLoadingRoles) {
        return 'Carregando...';
      }
      const role = roles.find((role) => role.id === roleId);
      return role ? (role as Role).label : 'Desconhecido';
    },
    [roles, isLoadingRoles]
  );

  return { roles, getRoleLabel, isLoadingRoles };
}
