import { Observation } from '@/core/domain/entities/observation.entity';

export interface UpdateObservationInput {
  id: string;
  observations?: string | null;
  hasPartnerBeingTreated?: boolean;
}

export type UpdateObservationOutput = Observation;
