import { Patient } from '@/core/domain/entities/patient.entity';

export interface UpdatePatientInput {
  id: string;
  data: Partial<
    Omit<Patient, 'id' | 'createdAt' | 'updatedAt' | 'deletedAt' | 'createdBy'>
  >;
}

export interface UpdatePatientOutput extends Patient {}
