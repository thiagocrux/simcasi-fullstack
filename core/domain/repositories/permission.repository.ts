import { Permission } from '../entities/permission.entity';

/**
 * Repository interface for Permission entity.
 * Permissions define granular access rights within the system.
 */
export interface PermissionRepository {
  /**
   * Searches for a permission by ID, including logically deleted ones if requested.
   */
  findById(id: string, includeDeleted?: boolean): Promise<Permission | null>;

  /**
   * Searches for a permission by its unique code (e.g., 'READ_PATIENT').
   * Essential for 'Restore' logic in case of unique constraint conflicts.
   */
  findByCode(
    code: string,
    includeDeleted?: boolean
  ): Promise<Permission | null>;

  /**
   * Lists all permissions with support for pagination and filtering.
   */
  findAll(params?: {
    skip?: number;
    take?: number;
    search?: string;
    includeDeleted?: boolean;
  }): Promise<{ items: Permission[]; total: number }>;

  /**
   * Creates a new permission record.
   */
  create(
    data: Omit<Permission, 'id' | 'createdAt' | 'updatedAt' | 'deletedAt'>
  ): Promise<Permission>;

  /**
   * Updates an existing permission record.
   */
  update(
    id: string,
    data: Partial<Omit<Permission, 'id' | 'createdAt'>>
  ): Promise<Permission>;

  /**
   * Executes Soft Delete (sets deletedAt).
   */
  softDelete(id: string): Promise<void>;

  /**
   * Restores a logically deleted permission (clears deletedAt).
   */
  restore(id: string): Promise<void>;
}
