import { User } from '@/core/domain/entities/user.entity';

/**
 * Input parameters for changing a user's password.
 */
export interface ChangePasswordInput {
  /** Unique identifier of the user. */
  userId: string;
  /** Current password of the user. */
  currentPassword: string;
  /** New password to be set. */
  newPassword: string;
}

/**
 * Output of the change password operation.
 * Returns the updated user entity without the password field.
 */
export interface ChangePasswordOutput extends Omit<User, 'password'> {}
