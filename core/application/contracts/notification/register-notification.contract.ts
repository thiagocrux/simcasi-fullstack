import { Notification } from '@/core/domain/entities/notification.entity';

export interface RegisterNotificationInput {
  patientId: string;
  sinan: string;
  observations?: string | null;
  createdBy: string;
}

export type RegisterNotificationOutput = Notification;
