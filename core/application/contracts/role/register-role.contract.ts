import { Role } from '@/core/domain/entities/role.entity';

/** Input parameters for registering a role. */
export interface RegisterRoleInput {
  /** Unique code identifier for the role. */
  code: string;
  /** Display label for the role. */
  label: string;
  /**
   * Optional array of Permission IDs to manage the many-to-many relationship.
   * This property is used by the infrastructure layer to synchronize associations.
   */
  permissionIds?: string[];
}

/** Output of the register role operation. */
export type RegisterRoleOutput = Role;
