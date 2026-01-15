import { Observation } from '@/core/domain/entities/observation.entity';
import { AuditMetadata } from '../common/audit-metadata.contract';

export interface RegisterObservationInput extends AuditMetadata {
  patientId: string;
  observations?: string | null;
  hasPartnerBeingTreated: boolean;
}

export type RegisterObservationOutput = Observation;
