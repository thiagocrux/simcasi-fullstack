import { Notification } from '@/core/domain/entities/notification.entity';
import { AuditMetadata } from '../common/audit-metadata.contract';

export interface RegisterNotificationInput extends AuditMetadata {
  patientId: string;
  sinan: string;
  observations?: string | null;
}

export type RegisterNotificationOutput = Notification;
