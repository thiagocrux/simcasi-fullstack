/** Input parameters for user logout. */
export interface LogoutInput {
  /** The identifier of the session to terminate. */
  sessionId: string;
}

/** Output of the logout operation. */
export type LogoutOutput = void;
