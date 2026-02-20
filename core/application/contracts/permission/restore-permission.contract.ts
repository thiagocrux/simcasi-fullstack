import { Permission } from '@/core/domain/entities/permission.entity';

/** Input parameters for restoring a deleted permission. */
export interface RestorePermissionInput {
  /** The unique identifier of the permission to restore. */
  id: string;
}

/** Output of the restore permission operation. */
export type RestorePermissionOutput = Permission;
