/**
 * Input parameters for deleting an exam.
 */
export interface DeleteExamInput {
  /** Unique identifier of the exam to be deleted. */
  id: string;
}

/**
 * Output of the exam deletion operation.
 * Always returns void.
 */
export type DeleteExamOutput = void;
