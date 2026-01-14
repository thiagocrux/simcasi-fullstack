import { Observation } from '@/core/domain/entities/observation.entity';

export interface RestoreObservationInput {
  id: string;
}

export type RestoreObservationOutput = Observation;
