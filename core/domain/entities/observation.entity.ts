/**
 * Represents general clinical observations or follow-up notes for a patient.
 * Focuses on active monitoring and partner treatment verification.
 */
export interface Observation {
  /** Unique identifier for the observation record. */
  id: string;
  /** Reference to the patient associated with these notes. */
  patientId: string;
  /** Detailed clinical or monitoring notes. */
  observations?: string | null;
  /** Flag indicating if the patient's sexual partner is undergoing treatment. */
  hasPartnerBeingTreated: boolean;
  /** Identifier of the user who registered the observation. */
  createdBy: string;
  /** Timestamp of registration. */
  createdAt: Date;
  /** Identifier of the user who last updated the record. */
  updatedBy?: string | null;
  /** Timestamp of the last update. */
  updatedAt?: Date | null;
  /** Timestamp of soft deletion. */
  deletedAt?: Date | null;
}
