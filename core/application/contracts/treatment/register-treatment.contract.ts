import { Treatment } from '@/core/domain/entities/treatment.entity';
import { AuditMetadata } from '../common/audit-metadata.contract';

export interface RegisterTreatmentInput extends AuditMetadata {
  patientId: string;
  medication: string;
  healthCenter: string;
  startDate: Date | string;
  dosage: string;
  observations?: string | null;
  partnerInformation?: string | null;
}

export type RegisterTreatmentOutput = Treatment;
