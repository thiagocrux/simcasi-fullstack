import { Role } from '../entities/role.entity';

/**
 * Repository interface for Role entity.
 * Roles define sets of permissions for users.
 */
export interface RoleRepository {
  /**
   * Searches for a role by ID, including logically deleted ones if requested.
   */
  findById(id: string, includeDeleted?: boolean): Promise<Role | null>;

  /**
   * Searches for a role by its unique code (e.g., 'ADMIN', 'USER').
   * Essential for 'Restore' logic in case of unique constraint conflicts.
   */
  findByCode(code: string, includeDeleted?: boolean): Promise<Role | null>;

  /**
   * Lists all roles with support for pagination and filtering.
   */
  findAll(params?: {
    skip?: number;
    take?: number;
    orderBy?: string;
    orderDir?: 'asc' | 'desc';
    search?: string;
    includeDeleted?: boolean;
  }): Promise<{ items: Role[]; total: number }>;

  /**
   * Creates a new role record.
   */
  create(
    data: Omit<Role, 'id' | 'createdAt' | 'updatedAt' | 'deletedAt'> & {
      permissionIds?: string[];
    }
  ): Promise<Role>;

  /**
   * Updates an existing role record.
   */
  update(
    id: string,
    data: Partial<Omit<Role, 'id' | 'createdAt'>> & {
      permissionIds?: string[];
    }
  ): Promise<Role>;

  /**
   * Executes Soft Delete (sets deletedAt).
   */
  softDelete(id: string): Promise<void>;

  /**
   * Restores a logically deleted role (clears deletedAt).
   */
  restore(id: string): Promise<void>;

  /**
   * Checks if a role has at least one of the required permissions.
   */
  hasPermissions(roleId: string, codes: string[]): Promise<boolean>;
}
