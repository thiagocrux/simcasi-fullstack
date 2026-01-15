import { Permission } from '@/core/domain/entities/permission.entity';

export interface RestorePermissionInput {
  id: string;
  restoredBy?: string;
  ipAddress?: string;
  userAgent?: string;
}

export type RestorePermissionOutput = Permission;
