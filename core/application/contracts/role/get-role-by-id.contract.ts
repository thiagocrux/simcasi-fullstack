import { Role } from '@/core/domain/entities/role.entity';

/** Input parameters for getting a role by ID. */
export interface GetRoleByIdInput {
  /** The unique identifier of the role. */
  id: string;
}

/** Output of the get role by ID operation. */
export type GetRoleByIdOutput = Role;
