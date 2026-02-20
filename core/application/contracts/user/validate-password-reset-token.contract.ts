/** Input parameters for validating a password reset token. */
export interface ValidatePasswordResetTokenInput {
  /** The unique recovery token string. */
  token: string;
}

/** Output of the validate password reset token operation. */
export interface ValidatePasswordResetTokenOutput {
  /** Whether the token is valid, unused, and not expired. */
  isValid: boolean;
  /** The email of the user associated with the token. */
  email?: string;
}
