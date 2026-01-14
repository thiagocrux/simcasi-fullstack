import { Patient } from '@/core/domain/entities/patient.entity';

export interface GetPatientInput {
  id: string;
  includeDeleted?: boolean;
}

export interface GetPatientOutput extends Patient {}
