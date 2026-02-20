import { Exam } from '@/core/domain/entities/exam.entity';

/**
 * Input parameters for restoring an exam.
 */
export interface RestoreExamInput {
  /** Unique identifier of the exam to restore. */
  id: string;
}

/**
 * Output of the restore exam operation.
 * Returns the restored exam entity.
 */
export type RestoreExamOutput = Exam;
