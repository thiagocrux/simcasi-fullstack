/**
 * Input data for requesting a password reset email.
 */
export interface RequestPasswordResetInput {
  /** The email address of the user who forgot their password. */
  email: string;
}

/**
 * Output for the forgot password request.
 * Often empty for security to not confirm or deny if email exists.
 */
export interface RequestPasswordResetOutput {
  /** Success message or identifier. */
  message: string;
}
