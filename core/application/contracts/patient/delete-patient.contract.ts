import { AuditMetadata } from '../common/audit-metadata.contract';

export interface DeletePatientInput extends AuditMetadata {
  id: string;
}

export type DeletePatientOutput = void;
