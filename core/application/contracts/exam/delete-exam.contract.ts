import { AuditMetadata } from '../common/audit-metadata.contract';

export interface DeleteExamInput extends AuditMetadata {
  id: string;
}

export type DeleteExamOutput = void;
