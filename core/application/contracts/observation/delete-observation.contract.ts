/**
 * Input parameters for deleting an observation.
 */
export interface DeleteObservationInput {
  /** Unique identifier of the observation to be deleted. */
  id: string;
}

/**
 * Output of the observation deletion operation.
 * Always returns void.
 */
export type DeleteObservationOutput = void;
