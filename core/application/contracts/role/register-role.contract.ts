import { Role } from '@/core/domain/entities/role.entity';

export interface RegisterRoleInput {
  code: string;
  createdBy?: string;
  ipAddress?: string;
  userAgent?: string;
}

export type RegisterRoleOutput = Role;
