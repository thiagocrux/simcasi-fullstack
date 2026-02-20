import { User } from '@/core/domain/entities/user.entity';

/** Input parameters for updating user information. */
export interface UpdateUserInput {
  /** The unique identifier of the user. */
  id: string;
  /** Full name of the user. */
  name?: string;
  /** Email address for the user. */
  email?: string;
  /** Optional new password to set. */
  password?: string;
  /** ID of the role assigned to the user. */
  roleId?: string;
}

/** Output of the update user operation. */
export interface UpdateUserOutput extends Omit<User, 'password'> {}
