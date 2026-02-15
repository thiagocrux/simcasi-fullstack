import { Notification } from '@/core/domain/entities/notification.entity';

export interface RestoreNotificationInput {
  id: string;
}

export type RestoreNotificationOutput = Notification;
