import { Role } from '../entities/role.entity';

/**
 * Repository interface for the Role entity.
 * Roles define sets of permissions for users.
 */
export interface RoleRepository {
  /**
   * Finds a role by ID, including soft-deleted ones if requested.
   *
   * @param id The role ID.
   * @param includeDeleted Whether to include soft-deleted records.
   * @return The found role or null.
   */
  findById(id: string, includeDeleted?: boolean): Promise<Role | null>;

  /**
   * Finds a role by its unique code (e.g., 'ADMIN', 'USER').
   * Essential for 'Restore' logic in case of unique constraint conflicts.
   *
   * @param code The role code.
   * @param includeDeleted Whether to include soft-deleted records.
   * @return The found role or null.
   */
  findByCode(code: string, includeDeleted?: boolean): Promise<Role | null>;

  /**
   * Lists all roles with pagination and filtering support.
   *
   * @param params Pagination and filtering parameters.
   * @return An object containing the list of roles and the total count.
   */
  findAll(params?: {
    skip?: number;
    take?: number;
    orderBy?: string;
    orderDir?: 'asc' | 'desc';
    search?: string;
    searchBy?: string;
    startDate?: string;
    endDate?: string;
    timezoneOffset?: string;
    includeDeleted?: boolean;
  }): Promise<{ items: Role[]; total: number }>;

  /**
   * Creates a new role record.
   *
   * @param data Data for role creation.
   * @return The created role.
   */
  create(
    data: Omit<Role, 'id' | 'createdAt' | 'updatedAt' | 'deletedAt'> & {
      permissionIds?: string[];
    }
  ): Promise<Role>;

  /**
   * Updates an existing role record.
   *
   * @param id The role ID.
   * @param data Data for role update.
   * @param updatedBy User who performed the update.
   * @return The updated role.
   */
  update(
    id: string,
    data: Partial<Omit<Role, 'id' | 'createdAt'>> & {
      permissionIds?: string[];
    },
    updatedBy: string
  ): Promise<Role>;

  /**
   * Performs a soft delete.
   *
   * @param id The role ID.
   * @param updatedBy ID from the user who performed the update.
   * @return A promise that resolves when the operation is complete.
   */
  softDelete(id: string, updatedBy: string): Promise<void>;

  /**
   * Restores a soft-deleted role.
   *
   * @param id The role ID.
   * @param updatedBy ID from the user who performed the restoration.
   * @return A promise that resolves when the operation is complete.
   */
  restore(id: string, updatedBy: string): Promise<void>;

  /**
   * Checks if a role has at least one of the requested permissions.
   *
   * @param roleId The role ID.
   * @param codes List of permission codes.
   * @return True if the role has any of the permissions, false otherwise.
   */
  hasPermissions(roleId: string, codes: string[]): Promise<boolean>;
}
