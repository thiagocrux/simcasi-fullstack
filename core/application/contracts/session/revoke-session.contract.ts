import { AuditMetadata } from '../common/audit-metadata.contract';

export interface RevokeSessionInput extends AuditMetadata {
  id: string;
}

export interface RevokeSessionOutput {
  success: boolean;
}
