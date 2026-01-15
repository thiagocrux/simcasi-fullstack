import { Treatment } from '@/core/domain/entities/treatment.entity';
import { AuditMetadata } from '../common/audit-metadata.contract';

export interface RestoreTreatmentInput extends AuditMetadata {
  id: string;
}

export type RestoreTreatmentOutput = Treatment;
