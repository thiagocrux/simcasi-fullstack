/**
 * Represents an active authentication session for a user.
 * Tracks usage context and enforces temporal access limits.
 */
export interface Session {
  /** Unique identifier for the persistent session. */
  id: string;
  /** Reference to the user who owns the session. */
  userId: string;
  /** Timestamp when the session was first created/authorized. */
  issuedAt: Date;
  /** Timestamp after which the session is considered invalid. */
  expiresAt: Date;
  /** IPv4 or IPv6 address where the session originated. */
  ipAddress: string;
  /** Browser or platform fingerprint used for the session. */
  userAgent: string;
  /** Timestamp of session persistence start. */
  createdAt: Date;
  /** Timestamp of the last session refresh or modification. */
  updatedAt?: Date | null;
  /** Timestamp of session logout or forced termination. */
  deletedAt?: Date | null;
}
