import { Observation } from '@/core/domain/entities/observation.entity';

export interface FindObservationsInput {
  skip?: number;
  take?: number;
  search?: string;
  patientId?: string;
  includeDeleted?: boolean;
}

export interface FindObservationsOutput {
  items: Observation[];
  total: number;
}
