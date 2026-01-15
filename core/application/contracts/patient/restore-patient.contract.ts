import { Patient } from '@/core/domain/entities/patient.entity';

export interface RestorePatientInput {
  id: string;
  restoredBy?: string;
  ipAddress?: string;
  userAgent?: string;
}

export interface RestorePatientOutput extends Patient {}
