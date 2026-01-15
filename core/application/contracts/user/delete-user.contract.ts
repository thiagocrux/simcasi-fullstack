import { AuditMetadata } from '../common/audit-metadata.contract';

export interface DeleteUserInput extends AuditMetadata {
  id: string;
}

export type DeleteUserOutput = void;
