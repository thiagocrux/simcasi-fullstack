import { User } from '@/core/domain/entities/user.entity';
/**
 * Input parameters for resetting the user's password using a valid token.
 */
export interface ResetPasswordInput {
  /** The unique recovery token string. */
  token: string;
  /** The new password to set for the account. */
  newPassword: string;
}

/**
 * Output of the password reset operation.
 */
export interface ResetPasswordOutput extends Omit<User, 'password'> {}
