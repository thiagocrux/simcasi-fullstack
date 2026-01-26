import { Treatment } from '@/core/domain/entities/treatment.entity';

export interface FindTreatmentsInput {
  skip?: number;
  take?: number;
  orderBy?: string;
  orderDir?: 'asc' | 'desc';
  search?: string;
  includeDeleted?: boolean;
  patientId?: string;
}

export interface FindTreatmentsOutput {
  items: Treatment[];
  total: number;
}
