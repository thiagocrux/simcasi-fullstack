import { Role } from '@/core/domain/entities/role.entity';

export interface UpdateRoleInput {
  id: string;
  code?: string;
  updatedBy?: string;
  ipAddress?: string;
  userAgent?: string;
}

export type UpdateRoleOutput = Role;
