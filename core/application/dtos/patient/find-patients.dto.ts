import { Patient } from '@/core/domain/entities/patient.entity';

export interface FindPatientsDto {
  skip?: number;
  take?: number;
  search?: string;
  includeDeleted?: boolean;
}

export interface FindPatientsResponseDto {
  items: Patient[];
  total: number;
}
