import { Observation } from '@/core/domain/entities/observation.entity';

export interface FindObservationsInput {
  skip?: number;
  take?: number;
  orderBy?: string;
  orderDir?: 'asc' | 'desc';
  search?: string;
  includeDeleted?: boolean;
  patientId?: string;
}

export interface FindObservationsOutput {
  items: Observation[];
  total: number;
}
