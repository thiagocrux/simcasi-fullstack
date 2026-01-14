import { Treatment } from '@/core/domain/entities/treatment.entity';

export interface FindTreatmentsInput {
  skip?: number;
  take?: number;
  search?: string;
  patientId?: string;
  includeDeleted?: boolean;
}

export interface FindTreatmentsOutput {
  items: Treatment[];
  total: number;
}
