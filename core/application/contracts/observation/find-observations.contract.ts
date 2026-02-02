import { Observation } from '@/core/domain/entities/observation.entity';

export interface FindObservationsInput {
  skip?: number;
  take?: number;
  orderBy?: string;
  orderDir?: 'asc' | 'desc';
  search?: string;
  searchBy?: string;
  startDate?: Date;
  endDate?: Date;
  patientId?: string;
  includeDeleted?: boolean;
}

export interface FindObservationsOutput {
  items: Observation[];
  total: number;
}
