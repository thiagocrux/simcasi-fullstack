import { User } from '../entities/user.entity';

export interface UserRepository {
  /**
   * Searches for an user by ID, including logically deleted ones if requested.
   */
  findById(id: string, includeDeleted?: boolean): Promise<User | null>;

  /**
   * Searches for an user by email. Useful for authentication and 'Restore' logic.
   */
  findByEmail(email: string, includeDeleted?: boolean): Promise<User | null>;

  /**
   * Lists users with support for pagination and filtering.
   */
  findAll(params?: {
    skip?: number;
    take?: number;
    search?: string;
    roleId?: string;
    includeDeleted?: boolean;
  }): Promise<{ items: User[]; total: number }>;

  /**
   * Creates a new user record.
   */
  create(
    data: Omit<User, 'id' | 'createdAt' | 'updatedAt' | 'deletedAt'> & {
      password: string;
    }
  ): Promise<User>;

  /**
   * Updates data of an existing user.
   */
  update(
    id: string,
    data: Partial<Omit<User, 'id' | 'createdAt'>>
  ): Promise<User>;

  /**
   * Executes Soft Delete (sets deletedAt).
   */
  softDelete(id: string): Promise<void>;

  /**
   * Restores a logically deleted user (clears deletedAt).
   */
  restore(id: string): Promise<void>;
}
