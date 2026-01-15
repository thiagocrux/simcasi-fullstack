import { Permission } from '@/core/domain/entities/permission.entity';

export interface RegisterPermissionInput {
  code: string;
  createdBy?: string;
  ipAddress?: string;
  userAgent?: string;
}

export type RegisterPermissionOutput = Permission;
