import { Patient } from '@/core/domain/entities/patient.entity';

export interface UpdatePatientDto {
  id: string;
  data: Partial<
    Omit<Patient, 'id' | 'createdAt' | 'updatedAt' | 'deletedAt' | 'createdBy'>
  >;
}
