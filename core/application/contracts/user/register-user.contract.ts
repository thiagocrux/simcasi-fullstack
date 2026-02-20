import { User } from '@/core/domain/entities/user.entity';

/**
 * Input parameters for registering a new user.
 */
export interface RegisterUserInput {
  /** Name of the user. */
  name: string;
  /** Email address of the user. */
  email: string;
  /** Password for the user account. */
  password: string;
  /** Role identifier for the user. */
  roleId: string;
}

/**
 * Output of the register user operation.
 * Returns the created user entity without the password field.
 */
export interface RegisterUserOutput extends Omit<User, 'password'> {}
