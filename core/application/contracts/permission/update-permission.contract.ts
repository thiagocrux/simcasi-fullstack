import { Permission } from '@/core/domain/entities/permission.entity';

export interface UpdatePermissionInput {
  id: string;
  code?: string;
}

export type UpdatePermissionOutput = Permission;
