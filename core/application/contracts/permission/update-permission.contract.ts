import { Permission } from '@/core/domain/entities/permission.entity';

export interface UpdatePermissionInput {
  id: string;
  code?: string;
  updatedBy?: string;
  ipAddress?: string;
  userAgent?: string;
}

export type UpdatePermissionOutput = Permission;
