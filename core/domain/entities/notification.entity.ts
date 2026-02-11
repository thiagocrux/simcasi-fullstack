/**
 * Represents a compulsory epidemiological notification.
 * Links the patient to the SINAN (Sistema de Informação de Agravos de Notificação) identifier.
 */
export interface Notification {
  /** Unique identifier for the notification record. */
  id: string;
  /** Reference to the patient being notified. */
  patientId: string;
  /** The unique number of the notification form in the SINAN system. */
  sinan: string;
  /** Complementary epidemiological observations. */
  observations?: string | null;
  /** Identifier of the user who registered the notification. */
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
