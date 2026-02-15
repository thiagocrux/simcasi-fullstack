import { Observation } from '@/core/domain/entities/observation.entity';

export interface RegisterObservationInput {
  patientId: string;
  observations?: string | null;
  hasPartnerBeingTreated: boolean;
}

export type RegisterObservationOutput = Observation;
