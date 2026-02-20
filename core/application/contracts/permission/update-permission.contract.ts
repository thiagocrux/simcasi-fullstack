import { Permission } from '@/core/domain/entities/permission.entity';

/** Input parameters for updating a permission. */
export interface UpdatePermissionInput {
  /** The unique identifier of the permission. */
  id: string;
  /** Unique code identifier for the permission. */
  code?: string;
  /**
   * Optional array of Role IDs to manage the many-to-many relationship.
   * Sending this will synchronize associations by replacing existing ones.
   */
  roleIds?: string[];
}

/** Output of the update permission operation. */
export type UpdatePermissionOutput = Permission;
