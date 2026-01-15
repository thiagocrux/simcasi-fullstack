import { Observation } from '@/core/domain/entities/observation.entity';

export interface UpdateObservationInput {
  id: string;
  observations?: string | null;
  hasPartnerBeingTreated?: boolean;
  updatedBy?: string;
  ipAddress?: string;
  userAgent?: string;
}

export type UpdateObservationOutput = Observation;
