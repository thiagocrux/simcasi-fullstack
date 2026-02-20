import { Observation } from '@/core/domain/entities/observation.entity';

/**
 * Input parameters for updating an existing observation.
 */
export interface UpdateObservationInput {
  /** Unique identifier of the observation to update. */
  id: string;
  /** Observations (optional). */
  observations?: string | null;
  /** Indicates if the partner is being treated (optional). */
  hasPartnerBeingTreated?: boolean;
}

/**
 * Output of the update observation operation.
 * Returns the updated observation entity.
 */
export type UpdateObservationOutput = Observation;
