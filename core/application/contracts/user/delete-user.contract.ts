/**
 * Input parameters for deleting a user.
 */
export interface DeleteUserInput {
  /** Unique identifier of the user to be deleted. */
  id: string;
}

/**
 * Output of the user deletion operation.
 * Always returns void.
 */
export type DeleteUserOutput = void;
