import { AuditMetadata } from '../common/audit-metadata.contract';

export interface DeleteNotificationInput extends AuditMetadata {
  id: string;
}

export type DeleteNotificationOutput = void;
