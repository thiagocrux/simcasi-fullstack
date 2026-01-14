import { Role } from '@/core/domain/entities/role.entity';

export interface RegisterRoleInput {
  code: string;
}

export type RegisterRoleOutput = Role;
