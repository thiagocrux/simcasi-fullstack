/**
 * Input parameters for deleting a treatment.
 */
export interface DeleteTreatmentInput {
  /** Unique identifier of the treatment to be deleted. */
  id: string;
}

/**
 * Output of the treatment deletion operation.
 * Always returns void.
 */
export type DeleteTreatmentOutput = void;
