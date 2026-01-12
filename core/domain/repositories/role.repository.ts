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
   * Lists all roles with support for pagination.
   */
  findAll(params?: {
    skip?: number;
    take?: number;
    includeDeleted?: boolean;
  }): Promise<{ items: Role[]; total: number }>;

  /**
   * Creates a new role record.
   */
  create(
    data: Omit<Role, 'id' | 'createdAt' | 'updatedAt' | 'deletedAt'>
  ): Promise<Role>;

  /**
   * Updates an existing role record.
   */
  update(
    id: string,
    data: Partial<Omit<Role, 'id' | 'createdAt'>>
  ): Promise<Role>;

  /**
   * Executes Soft Delete (sets deletedAt).
   */
  softDelete(id: string): Promise<void>;

  /**
   * Restores a logically deleted role (clears deletedAt).
   */
  restore(id: string): Promise<void>;
}
