import { Observation } from '@/core/domain/entities/observation.entity';

/**
 * Input parameters for registering a new observation.
 */
export interface RegisterObservationInput {
  /** Patient identifier. */
  patientId: string;
  /** Observations (optional). */
  observations?: string | null;
  /** Indicates if the partner is being treated. */
  hasPartnerBeingTreated: boolean;
}

/**
 * Output of the register observation operation.
 * Returns the created observation entity.
 */
export type RegisterObservationOutput = Observation;
