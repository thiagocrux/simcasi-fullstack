/**
 * Represents a security role within the system.
 * Groups sets of capabilities (permissions) to simplify access management.
 */
export interface Role {
  /** Unique identifier for the role. */
  id: string;
  /** Unique programmatic string (e.g., 'ADMIN', 'DOCTOR'). */
  code: string;
  /** Human-readable display name for the role. */
  label: string;
  /** Identifier of the user who created this role. */
  createdBy?: string | null;
  /** Timestamp of role creation. */
  createdAt: Date;
  /** Identifier of the user who last modified this role. */
  updatedBy?: string | null;
  /** Timestamp of the last role modification. */
  updatedAt?: Date | null;
  /** Timestamp of soft deletion/role deprecation. */
  deletedAt?: Date | null;
}
