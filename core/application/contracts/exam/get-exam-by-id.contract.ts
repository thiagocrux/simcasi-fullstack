import { Exam } from '@/core/domain/entities/exam.entity';

/**
 * Input parameters for retrieving an exam by ID.
 */
export interface GetExamByIdInput {
  /** Unique identifier of the exam to retrieve. */
  id: string;
}

/**
 * Output of the get exam by ID operation.
 * Returns the exam entity.
 */
export type GetExamByIdOutput = Exam;
