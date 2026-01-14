import { Observation } from '@/core/domain/entities/observation.entity';

export interface GetObservationByIdInput {
  id: string;
}

export type GetObservationByIdOutput = Observation;
