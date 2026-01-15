import { Patient } from '@/core/domain/entities/patient.entity';
import { AuditMetadata } from '../common/audit-metadata.contract';

export interface RestorePatientInput extends AuditMetadata {
  id: string;
}

export interface RestorePatientOutput extends Patient {}
