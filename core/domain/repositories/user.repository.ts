import { User } from '../entities/user.entity';

/**
 * Repository interface for the User entity.
 * Manages the lifecycle and authentication of system users.
 */
export interface UserRepository {
  /**
   * Finds a user by ID, including soft-deleted ones if requested.
   *
   * @param id The user ID.
   * @param includeDeleted Whether to include soft-deleted records.
   * @return The found user or null.
   */
  findById(id: string, includeDeleted?: boolean): Promise<User | null>;

  /**
   * Finds a user by email. Useful for authentication and 'Restore' logic.
   *
   * @param email The user email.
   * @param includeDeleted Whether to include soft-deleted records.
   * @return The found user or null.
   */
  findByEmail(email: string, includeDeleted?: boolean): Promise<User | null>;

  /**
   * Lists users with pagination and filtering support.
   *
   * @param params Pagination and filtering parameters.
   * @return An object containing the list of users and the total count.
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
    roleId?: string;
    includeDeleted?: boolean;
  }): Promise<{ items: User[]; total: number }>;

  /**
   * Creates a new user record.
   *
   * @param data Data for user creation.
   * @return The created user.
   */
  create(
    data: Omit<User, 'id' | 'createdAt' | 'updatedAt' | 'deletedAt'> & {
      password: string;
    }
  ): Promise<User>;

  /**
   * Updates data of an existing user.
   *
   * @param id The user ID.
   * @param data Data for user update.
   * @param updatedBy User who performed the update.
   * @return The updated user.
   */
  update(
    id: string,
    data: Partial<Omit<User, 'id' | 'createdAt'>>,
    updatedBy: string
  ): Promise<User>;

  /**
   * Updates the password of an existing user.
   *
   * @param id The user ID.
   * @param newPassword The new hashed password.
   * @param updatedBy The user performing the update.
   * @return The updated user.
   */
  updatePassword(
    id: string,
    newPassword: string,
    updatedBy: string
  ): Promise<User>;

  /**
   * Finds multiple users by an array of IDs.
   *
   * @param ids List of user IDs.
   * @return List of found users.
   */
  findByIds(ids: string[]): Promise<User[]>;

  /**
   * Performs a soft delete.
   *
   * @param id The user ID.
   * @param updatedBy ID from the user who performed the update.
   * @return A promise that resolves when the operation is complete.
   */
  softDelete(id: string, updatedBy: string): Promise<void>;

  /**
   * Restores a soft-deleted user.
   *
   * @param id The user ID.
   * @param updatedBy ID from the user who performed the restoration.
   * @return A promise that resolves when the operation is complete.
   */
  restore(id: string, updatedBy: string): Promise<void>;
}
