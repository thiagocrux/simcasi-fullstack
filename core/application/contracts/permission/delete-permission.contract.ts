import { AuditMetadata } from '../common/audit-metadata.contract';

export interface DeletePermissionInput extends AuditMetadata {
  id: string;
}

export type DeletePermissionOutput = void;
