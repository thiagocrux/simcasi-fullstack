import { Role } from '@/core/domain/entities/role.entity';

export interface RegisterRoleInput {
  code: string;
  label: string;
  /**
   * Optional array of Permission IDs to manage the many-to-many relationship.
   * This property is used by the infrastructure layer to synchronize associations.
   */
  permissionIds?: string[];
}

export type RegisterRoleOutput = Role;
