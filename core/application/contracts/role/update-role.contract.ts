import { Role } from '@/core/domain/entities/role.entity';

export interface UpdateRoleInput {
  id: string;
  code?: string;
}

export type UpdateRoleOutput = Role;
