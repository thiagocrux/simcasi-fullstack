import { Observation } from '@/core/domain/entities/observation.entity';
import { AuditMetadata } from '../common/audit-metadata.contract';

export interface UpdateObservationInput extends AuditMetadata {
  id: string;
  observations?: string | null;
  hasPartnerBeingTreated?: boolean;
}

export type UpdateObservationOutput = Observation;
