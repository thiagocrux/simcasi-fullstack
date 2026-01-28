import { useCallback, useMemo } from 'react';

import { useQuery } from '@tanstack/react-query';

import { findRoles } from '@/app/actions/role.actions';
import { ROLE_OPTIONS } from '@/core/domain/constants/role.constants';

export function useRoles() {
  const { data: response, isLoading: isLoadingRoles } = useQuery({
    queryKey: ['find-roles'],
    queryFn: () => findRoles({ take: 100, includeDeleted: true }),
    staleTime: 1000 * 60 * 60,
  });

  const roles = useMemo(
    () => (response?.success ? response.data.items : []),
    [response]
  );

  const getRoleLabel = useCallback(
    (roleId: string | null): string | null => {
      if (!roleId) {
        return null;
      }

      if (isLoadingRoles) {
        return 'Carregando...';
      }

      const role = roles.find((role) => role.id === roleId);
      if (!role) {
        return null;
      }

      const roleOption = ROLE_OPTIONS.find(
        (roleOption) => roleOption.value === role.code
      );
      return roleOption ? roleOption.label : 'Desconhecido';
    },
    [roles, isLoadingRoles]
  );

  return { roles, getRoleLabel, isLoadingRoles };
}
