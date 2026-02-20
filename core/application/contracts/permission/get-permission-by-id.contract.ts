import { Permission } from '@/core/domain/entities/permission.entity';

/** Input parameters for getting a permission by ID. */
export interface GetPermissionByIdInput {
  /** The unique identifier of the permission. */
  id: string;
}

/** Output of the get permission by ID operation. */
export type GetPermissionByIdOutput = Permission;
