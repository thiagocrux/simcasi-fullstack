import { Notification } from '@/core/domain/entities/notification.entity';
import { AuditMetadata } from '../common/audit-metadata.contract';

export interface RestoreNotificationInput extends AuditMetadata {
  id: string;
}

export type RestoreNotificationOutput = Notification;
