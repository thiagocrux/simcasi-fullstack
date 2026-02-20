/**
 * Input parameters for requesting a password reset email.
 */
export interface RequestPasswordResetInput {
  /** Email address of the user who forgot their password. */
  email: string;
}

/**
 * Output of the password reset request operation.
 * Often empty for security reasons (not confirming if email exists).
 */
export interface RequestPasswordResetOutput {
  /** Success message or identifier. */
  message: string;
}
