import { Observation } from '@/core/domain/entities/observation.entity';

export interface RegisterObservationInput {
  patientId: string;
  observations?: string | null;
  hasPartnerBeingTreated: boolean;
  createdBy?: string;
  ipAddress?: string;
  userAgent?: string;
}

export type RegisterObservationOutput = Observation;
