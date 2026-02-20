import { User } from '@/core/domain/entities/user.entity';

/**
 * Input parameters for retrieving a user by ID.
 */
export interface GetUserByIdInput {
  /** Unique identifier of the user to retrieve. */
  id: string;
  /** Whether to include deleted users. */
  includeDeleted?: boolean;
}

/**
 * Output of the get user by ID operation.
 * Returns the user entity without the password field.
 */
export interface GetUserByIdOutput extends Omit<User, 'password'> {}
