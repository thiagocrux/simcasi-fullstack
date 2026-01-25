import { useQuery } from '@tanstack/react-query';

import { findRoles } from '@/app/actions/role.actions';
import { ROLE_OPTIONS } from '@/core/domain/constants/role.constants';

export function useRoles() {
  const { data: response, isLoading: isLoadingRoles } = useQuery({
    queryKey: ['find-roles'],
    queryFn: () => findRoles({ skip: 0, take: 100, includeDeleted: true }),
    staleTime: 1000 * 60 * 60,
  });

  const roles = response?.success ? response.data.items : [];

  const getRoleLabel = (roleId: string | null): string | null => {
    if (!roleId) {
      return null;
    }

    const role = roles.filter((role) => role.id === roleId);
    return ROLE_OPTIONS.filter(
      (roleOption) => roleOption.value === role[0].code
    )[0].label;
  };

  return { roles, getRoleLabel, isLoadingRoles };
}
