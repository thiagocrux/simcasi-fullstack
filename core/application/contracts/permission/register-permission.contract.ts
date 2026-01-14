import { Permission } from '@/core/domain/entities/permission.entity';

export interface RegisterPermissionInput {
  code: string;
}

export type RegisterPermissionOutput = Permission;
