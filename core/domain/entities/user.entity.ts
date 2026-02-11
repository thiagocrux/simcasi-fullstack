/**
 * Represents a system user (healthcare professional, administrator, or internal service).
 * Handles authentication credentials and access control through roles.
 */
export interface User {
  /** Unique identifier for the user. */
  id: string;
  /** Full name of the user. */
  name: string;
  /** Primary electronic mail address used for login and notifications. */
  email: string;
  /** Hashed password string. Omitted in most responses for security. */
  password?: string;
  /** Reference to the assigned security role. */
  roleId: string;
  /** Flag indicating if the user is a built-in system account (non-person). */
  isSystem?: boolean;
  /** Identifier of the user who created this account. */
  createdBy?: string | null;
  /** Timestamp of account creation. */
  createdAt: Date;
  /** Identifier of the user who last modified this account. */
  updatedBy?: string | null;
  /** Timestamp of the last account modification. */
  updatedAt?: Date | null;
  /** Timestamp of soft deletion/account deactivation. */
  deletedAt?: Date | null;
}
