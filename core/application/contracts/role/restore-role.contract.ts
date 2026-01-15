import { Role } from '@/core/domain/entities/role.entity';

export interface RestoreRoleInput {
  id: string;
  restoredBy?: string;
  ipAddress?: string;
  userAgent?: string;
}

export type RestoreRoleOutput = Role;
