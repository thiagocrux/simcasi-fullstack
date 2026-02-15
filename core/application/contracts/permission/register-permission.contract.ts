import { Permission } from '@/core/domain/entities/permission.entity';

export interface RegisterPermissionInput {
  code: string;
  label: string;
  /**
   * Optional array of Role IDs to manage the many-to-many relationship.
   * This property is used by the infrastructure layer to synchronize associations.
   */
  roleIds?: string[];
}

export type RegisterPermissionOutput = Permission;
