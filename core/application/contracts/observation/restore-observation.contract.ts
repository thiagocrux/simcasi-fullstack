import { Observation } from '@/core/domain/entities/observation.entity';

export interface RestoreObservationInput {
  id: string;
  restoredBy?: string;
  ipAddress?: string;
  userAgent?: string;
}

export type RestoreObservationOutput = Observation;
