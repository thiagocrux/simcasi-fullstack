/** Input parameters for revoking (deleting) a session. */
export interface RevokeSessionInput {
  /** The unique identifier of the session to revoke. */
  id: string;
}

/** Output of the revoke session operation. */
export interface RevokeSessionOutput {
  /** Whether the operation was successful. */
  success: boolean;
}
