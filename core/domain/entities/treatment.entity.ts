/**
 * Represents a medical treatment prescribed to a patient.
 * Tracks clinical interventions, medications, and relevant health center information.
 */
export interface Treatment {
  /** Unique identifier for the treatment record. */
  id: string;
  /** Reference to the patient receiving treatment. */
  patientId: string;
  /** Name of the medication prescribed (e.g., Penicilina Benzatina). */
  medication: string;
  /** Name of the Health Center (Unidade de Saúde) where treatment is administered. */
  healthCenter: string;
  /** Date when the treatment started. */
  startDate: Date;
  /** Specific dosage instructions for the medication. */
  dosage: string;
  /** Additional clinical observations regarding the treatment. */
  observations?: string | null;
  /** Information regarding the treatment status of the patient's sexual partners. */
  partnerInformation?: string | null;
  /** Identifier of the user who registered the treatment. */
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
