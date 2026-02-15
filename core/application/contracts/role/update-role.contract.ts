import { Role } from '@/core/domain/entities/role.entity';

export interface UpdateRoleInput {
  id: string;
  code?: string;
  /**
   * Optional array of Permission IDs to manage the many-to-many relationship.
   * Sending this will synchronize associations by replacing existing ones.
   */
  permissionIds?: string[];
}

export type UpdateRoleOutput = Role;
