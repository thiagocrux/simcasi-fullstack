import { Treatment } from '@/core/domain/entities/treatment.entity';
import { AuditMetadata } from '../common/audit-metadata.contract';

export interface UpdateTreatmentInput extends AuditMetadata {
  id: string;
  medication?: string;
  healthCenter?: string;
  startDate?: Date | string;
  dosage?: string;
  observations?: string | null;
  partnerInformation?: string | null;
}

export type UpdateTreatmentOutput = Treatment;
