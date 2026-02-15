import { Permission } from '@/core/domain/entities/permission.entity';

export interface UpdatePermissionInput {
  id: string;
  code?: string;
  /**
   * Optional array of Role IDs to manage the many-to-many relationship.
   * Sending this will synchronize associations by replacing existing ones.
   */
  roleIds?: string[];
}

export type UpdatePermissionOutput = Permission;
