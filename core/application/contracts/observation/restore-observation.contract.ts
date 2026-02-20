import { Observation } from '@/core/domain/entities/observation.entity';

/**
 * Input parameters for restoring an observation.
 */
export interface RestoreObservationInput {
  /** Unique identifier of the observation to restore. */
  id: string;
}

/**
 * Output of the restore observation operation.
 * Returns the restored observation entity.
 */
export type RestoreObservationOutput = Observation;
