/**
 * Represents a transient token used for password recovery flows.
 * These tokens are single-use, have a short expiration period, and are linked to a specific user.
 */
export interface PasswordResetToken {
  /** Unique identifier for the token record. */
  id: string;
  /** Reference to the user who requested the password reset. */
  userId: string;
  /** The unique secure token string (often hashed in storage). */
  token: string;
  /** The date and time when the token loses its validity. */
  expiresAt: Date;
  /** The date and time when the token was successfully used for redefinition. */
  usedAt?: Date | null;
  /** Timestamp of token record creation. */
  createdAt: Date;
  /** Timestamp of the last record modification. */
  updatedAt?: Date | null;
  /** Timestamp of soft deletion/invalidation of the record. */
  deletedAt?: Date | null;
}
