import { Role } from '@/core/domain/entities/role.entity';

/** Input parameters for updating a role. */
export interface UpdateRoleInput {
  /** The unique identifier of the role. */
  id: string;
  /** Unique code identifier for the role. */
  code?: string;
  /**
   * Optional array of Permission IDs to manage the many-to-many relationship.
   * Sending this will synchronize associations by replacing existing ones.
   */
  permissionIds?: string[];
}

/** Output of the update role operation. */
export type UpdateRoleOutput = Role;
