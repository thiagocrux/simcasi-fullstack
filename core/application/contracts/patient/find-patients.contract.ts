import { Patient } from '@/core/domain/entities/patient.entity';

export interface FindPatientsInput {
  skip?: number;
  take?: number;
  search?: string;
  includeDeleted?: boolean;
}

export interface FindPatientsOutput {
  items: Patient[];
  total: number;
}
