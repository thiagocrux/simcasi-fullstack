import { AuditMetadata } from '../common/audit-metadata.contract';

export interface DeleteTreatmentInput extends AuditMetadata {
  id: string;
}

export type DeleteTreatmentOutput = void;
