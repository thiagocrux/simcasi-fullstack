import { Permission } from '../entities/permission.entity';

/**
 * Repository interface for the Permission entity.
 * Permissions define granular access rights within the system.
 */
export interface PermissionRepository {
  /**
   * Finds a permission by ID, including soft-deleted ones if requested.
   *
   * @param id The permission ID.
   * @param includeDeleted Whether to include soft-deleted records.
   * @return The found permission or null.
   */
  findById(id: string, includeDeleted?: boolean): Promise<Permission | null>;

  /**
   * Finds multiple permissions by their IDs.
   * Useful for validating associations.
   *
   * @param ids List of permission IDs.
   * @return List of found permissions.
   */
  findByIds(ids: string[]): Promise<Permission[]>;

  /**
   * Finds a permission by its unique code (e.g., 'READ_PATIENT').
   * Essential for 'Restore' logic in case of unique constraint conflicts.
   *
   * @param code The permission code.
   * @param includeDeleted Whether to include soft-deleted records.
   * @return The found permission or null.
   */
  findByCode(
    code: string,
    includeDeleted?: boolean
  ): Promise<Permission | null>;

  /**
   * Finds all permissions assigned to a specific role.
   *
   * @param roleId The role ID.
   * @return List of role permissions.
   */
  findByRoleId(roleId: string): Promise<Permission[]>;

  /**
   * Lists all permissions with pagination and filtering support.
   *
   * @param params Pagination and filtering parameters.
   * @return An object containing the list of permissions and the total count.
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
  }): Promise<{ items: Permission[]; total: number }>;

  /**
   * Creates a new permission record.
   *
   * @param data Data for permission creation.
   * @return The created permission.
   */
  create(
    data: Omit<Permission, 'id' | 'createdAt' | 'updatedAt' | 'deletedAt'> & {
      roleIds?: string[];
    }
  ): Promise<Permission>;

  /**
   * Updates an existing permission record.
   *
   * @param id The permission ID.
   * @param data Data for permission update.
   * @param updatedBy User who performed the update.
   * @return The updated permission.
   */
  update(
    id: string,
    data: Partial<Omit<Permission, 'id' | 'createdAt'>> & {
      roleIds?: string[];
    },
    updatedBy: string
  ): Promise<Permission>;

  /**
   * Performs a soft delete.
   *
   * @param id The permission ID.
   * @param updatedBy ID from the user who performed the update.
   * @return A promise that resolves when the operation is complete.
   */
  softDelete(id: string, updatedBy: string): Promise<void>;

  /**
   * Restores a soft-deleted permission.
   *
   * @param id The permission ID.
   * @param updatedBy ID from the user who performed the restoration.
   * @return A promise that resolves when the operation is complete.
   */
  restore(id: string, updatedBy: string): Promise<void>;
}
