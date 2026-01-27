import { Treatment } from '@/core/domain/entities/treatment.entity';

export interface FindTreatmentsInput {
  skip?: number;
  take?: number;
  orderBy?: string;
  orderDir?: 'asc' | 'desc';
  startDate?: Date;
  endDate?: Date;
  search?: string;
  patientId?: string;
  includeDeleted?: boolean;
}

export interface FindTreatmentsOutput {
  items: Treatment[];
  total: number;
}
