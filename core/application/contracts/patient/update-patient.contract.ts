import { Patient } from '@/core/domain/entities/patient.entity';

export interface UpdatePatientInput {
  id: string;
  data: Partial<
    Omit<Patient, 'id' | 'createdAt' | 'updatedAt' | 'deletedAt' | 'createdBy'>
  >;
  updatedBy?: string;
  ipAddress?: string;
  userAgent?: string;
}

export interface UpdatePatientOutput extends Patient {}
