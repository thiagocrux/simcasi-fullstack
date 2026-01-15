import { Notification } from '@/core/domain/entities/notification.entity';

export interface UpdateNotificationInput {
  id: string;
  sinan?: string;
  observations?: string | null;
  updatedBy?: string;
  ipAddress?: string;
  userAgent?: string;
}

export type UpdateNotificationOutput = Notification;
