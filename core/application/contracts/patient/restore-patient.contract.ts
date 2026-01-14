import { Patient } from '@/core/domain/entities/patient.entity';

export interface RestorePatientInput {
  id: string;
}

export interface RestorePatientOutput extends Patient {}
