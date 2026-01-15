import { AuditMetadata } from '../common/audit-metadata.contract';

export interface DeleteObservationInput extends AuditMetadata {
  id: string;
}

export type DeleteObservationOutput = void;
