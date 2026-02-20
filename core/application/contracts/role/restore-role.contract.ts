import { Role } from '@/core/domain/entities/role.entity';

/** Input parameters for restoring a deleted role. */
export interface RestoreRoleInput {
  /** The unique identifier of the role to restore. */
  id: string;
}

/** Output of the restore role operation. */
export type RestoreRoleOutput = Role;
