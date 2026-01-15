import { Observation } from '@/core/domain/entities/observation.entity';
import { AuditMetadata } from '../common/audit-metadata.contract';

export interface RestoreObservationInput extends AuditMetadata {
  id: string;
}

export type RestoreObservationOutput = Observation;
