import { Permission } from '@/core/domain/entities/permission.entity';

export interface GetPermissionByIdInput {
  id: string;
}

export type GetPermissionByIdOutput = Permission;
