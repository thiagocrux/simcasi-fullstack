import { Exam } from '@/core/domain/entities/exam.entity';

/**
 * Input parameters for updating an existing exam.
 */
export interface UpdateExamInput {
  /** Unique identifier of the exam to update. */
  id: string;
  /** Type of treponemal test (optional). */
  treponemalTestType?: string;
  /** Result of treponemal test (optional). */
  treponemalTestResult?: string;
  /** Date of treponemal test (optional). */
  treponemalTestDate?: Date | string;
  /** Location where treponemal test was performed (optional). */
  treponemalTestLocation?: string;
  /** VDRL nontreponemal test result (optional). */
  nontreponemalVdrlTest?: string;
  /** Titration of nontreponemal test (optional). */
  nontreponemalTestTitration?: string;
  /** Date of nontreponemal test (optional). */
  nontreponemalTestDate?: Date | string;
  /** Other nontreponemal test (optional). */
  otherNontreponemalTest?: string | null;
  /** Date of other nontreponemal test (optional). */
  otherNontreponemalTestDate?: Date | string | null;
  /** Reference observations (optional). */
  referenceObservations?: string;
}

/**
 * Output of the update exam operation.
 * Returns the updated exam entity.
 */
export type UpdateExamOutput = Exam;
