import { Notification } from '@/core/domain/entities/notification.entity';

export interface RegisterNotificationInput {
  patientId: string;
  sinan: string;
  observations?: string | null;
}

export type RegisterNotificationOutput = Notification;
