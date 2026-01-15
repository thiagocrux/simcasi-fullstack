import { AuditMetadata } from '../common/audit-metadata.contract';

export interface DeleteRoleInput extends AuditMetadata {
  id: string;
}

export type DeleteRoleOutput = void;
