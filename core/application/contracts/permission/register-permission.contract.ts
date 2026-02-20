import { Permission } from '@/core/domain/entities/permission.entity';

/** Input parameters for registering a permission. */
export interface RegisterPermissionInput {
  /** Unique code identifier for the permission. */
  code: string;
  /** Display label for the permission. */
  label: string;
  /**
   * Optional array of Role IDs to manage the many-to-many relationship.
   * This property is used by the infrastructure layer to synchronize associations.
   */
  roleIds?: string[];
}

/** Output of the register permission operation. */
export type RegisterPermissionOutput = Permission;
