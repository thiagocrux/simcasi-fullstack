import { Permission } from '@/core/domain/entities/permission.entity';

export interface RestorePermissionInput {
  id: string;
}

export type RestorePermissionOutput = Permission;
