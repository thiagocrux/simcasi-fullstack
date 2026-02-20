/** Input parameters for validating an active session token. */
export interface ValidateSessionInput {
  /** The JWT access token to validate. */
  token: string;
}

/** Output of the validate session operation. */
export interface ValidateSessionOutput {
  /** ID of the user associated with the token. */
  userId: string;
  /** ID of the user's current role. */
  roleId: string;
  /** Human-readable code of the user's current role. */
  roleCode: string;
  /** Unique identifier of the session. */
  sessionId: string;
}
