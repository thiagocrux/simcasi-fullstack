import { Exam } from '@/core/domain/entities/exam.entity';

/**
 * Input parameters for registering a new exam.
 */
export interface RegisterExamInput {
  /** Patient identifier. */
  patientId: string;
  /** Type of treponemal test. */
  treponemalTestType: string;
  /** Result of treponemal test. */
  treponemalTestResult: string;
  /** Date of treponemal test. */
  treponemalTestDate: Date | string;
  /** Location where treponemal test was performed. */
  treponemalTestLocation: string;
  /** VDRL nontreponemal test result. */
  nontreponemalVdrlTest: string;
  /** Titration of nontreponemal test. */
  nontreponemalTestTitration: string;
  /** Date of nontreponemal test. */
  nontreponemalTestDate: Date | string;
  /** Other nontreponemal test (optional). */
  otherNontreponemalTest?: string | null;
  /** Date of other nontreponemal test (optional). */
  otherNontreponemalTestDate?: Date | string | null;
  /** Reference observations. */
  referenceObservations: string;
}

/**
 * Output of the register exam operation.
 * Returns the created exam entity.
 */
export type RegisterExamOutput = Exam;
