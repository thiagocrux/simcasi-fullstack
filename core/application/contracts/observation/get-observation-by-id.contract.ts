import { Observation } from '@/core/domain/entities/observation.entity';

/**
 * Input parameters for retrieving an observation by ID.
 */
export interface GetObservationByIdInput {
  /** Unique identifier of the observation to retrieve. */
  id: string;
}

/**
 * Output of the get observation by ID operation.
 * Returns the observation entity.
 */
export type GetObservationByIdOutput = Observation;
