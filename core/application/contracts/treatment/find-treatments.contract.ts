import { Treatment } from '@/core/domain/entities/treatment.entity';

export interface FindTreatmentsInput {
  skip?: number;
  take?: number;
  orderBy?: string;
  orderDir?: 'asc' | 'desc';
  search?: string;
  searchBy?: string;
  startDate?: string;
  endDate?: string;
  timezoneOffset?: string;
  patientId?: string;
  includeDeleted?: boolean;
}

export interface FindTreatmentsOutput {
  items: Treatment[];
  total: number;
}
