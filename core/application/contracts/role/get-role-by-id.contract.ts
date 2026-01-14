import { Role } from '@/core/domain/entities/role.entity';

export interface GetRoleByIdInput {
  id: string;
}

export type GetRoleByIdOutput = Role;
