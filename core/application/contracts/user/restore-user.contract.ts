import { User } from '@/core/domain/entities/user.entity';

/** Input parameters for restoring a soft-deleted user. */
export interface RestoreUserInput {
  /** The unique identifier of the user to restore. */
  id: string;
}

/** Output of the restore user operation. */
export interface RestoreUserOutput extends Omit<User, 'password'> {}
