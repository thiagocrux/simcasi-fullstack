/**
 * Represents a specific granular capability or action permitted in the system.
 */
export interface Permission {
  /** Unique identifier for the permission. */
  id: string;
  /** Unique programmatic identifier (e.g., 'PATIENT_CREATE'). */
  code: string;
  /** Human-readable description of the capability. */
  label: string;
  /** Identifier of the user who created this permission. */
  createdBy?: string | null;
  /** Timestamp of permission creation. */
  createdAt: Date;
  /** Identifier of the user who last modified this permission. */
  updatedBy?: string | null;
  /** Timestamp of the last permission modification. */
  updatedAt?: Date | null;
  /** Timestamp of soft deletion. */
  deletedAt?: Date | null;
}
