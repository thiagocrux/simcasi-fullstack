/**
 * Input for validating a password reset token.
 */
export interface ValidatePasswordResetTokenInput {
  /** The unique recovery token string. */
  token: string;
}

/**
 * Output for the validation check.
 */
export interface ValidatePasswordResetTokenOutput {
  /** Whether the token is valid, not used, and not expired. */
  isValid: boolean;
  /** The email of the user associated with the token (for UI display if needed). */
  email?: string;
}
