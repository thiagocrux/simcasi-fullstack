import { Role } from '@/core/domain/entities/role.entity';

export interface RestoreRoleInput {
  id: string;
}

export type RestoreRoleOutput = Role;
