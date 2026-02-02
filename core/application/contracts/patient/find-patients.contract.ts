import { Patient } from '@/core/domain/entities/patient.entity';

export interface FindPatientsInput {
  skip?: number;
  take?: number;
  orderBy?: string;
  orderDir?: 'asc' | 'desc';
  search?: string;
  searchBy?: string;
  startDate?: Date;
  endDate?: Date;
  includeDeleted?: boolean;
}

export interface FindPatientsOutput {
  items: Patient[];
  total: number;
}
