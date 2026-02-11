/**
 * Represents a laboratory exam related to syphilis monitoring.
 * Stores results for both treponemal and non-treponemal tests in accordance with Brazilian clinical protocols.
 */
export interface Exam {
  /** Unique identifier for the exam record. */
  id: string;
  /** Reference to the patient who performed the exam. */
  patientId: string;
  /** The type of treponemal test used (e.g., FTA-Abs, ELISA, Rapid Test). */
  treponemalTestType: string;
  /** The result of the treponemal test (Positive/Reactive or Negative/Non-reactive). */
  treponemalTestResult: string;
  /** Date when the treponemal test was performed. */
  treponemalTestDate: Date;
  /** Location (clinic/hospital) where the treponemal test was performed. */
  treponemalTestLocation: string;
  /** Result or type of the primary non-treponemal test (VDRL). */
  nontreponemalVdrlTest: string;
  /** The titration level for the non-treponemal test (e.g., 1:32, 1:64). Essential for monitoring cure. */
  nontreponemalTestTitration: string;
  /** Date when the non-treponemal test was performed. */
  nontreponemalTestDate: Date;
  /** Any other complementary non-treponemal test performed. */
  otherNontreponemalTest?: string | null;
  /** Date of the complementary non-treponemal test. */
  otherNontreponemalTestDate?: Date | null;
  /** Clinical notes or reference observations for the exams. */
  referenceObservations: string;
  /** Identifier of the user who registered the exam. */
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
