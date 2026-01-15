import { Notification } from '@/core/domain/entities/notification.entity';
import { AuditMetadata } from '../common/audit-metadata.contract';

export interface UpdateNotificationInput extends AuditMetadata {
  id: string;
  sinan?: string;
  observations?: string | null;
}

export type UpdateNotificationOutput = Notification;
