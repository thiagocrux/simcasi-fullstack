/**
 * Input for the RevokeAllSessionsUseCase.
 */
export interface RevokeAllSessionsInput {
  /** The ID of the user whose sessions will be revoked. */
  userId: string;
}

/**
 * Output for the RevokeAllSessionsUseCase.
 */
export interface RevokeAllSessionsOutput {
  success: boolean;
}
