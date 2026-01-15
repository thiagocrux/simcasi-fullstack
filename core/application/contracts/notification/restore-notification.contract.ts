import { Notification } from '@/core/domain/entities/notification.entity';

export interface RestoreNotificationInput {
  id: string;
  restoredBy?: string;
  ipAddress?: string;
  userAgent?: string;
}

export type RestoreNotificationOutput = Notification;
