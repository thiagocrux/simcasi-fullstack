import { Notification } from '@/core/domain/entities/notification.entity';

export interface UpdateNotificationInput {
  id: string;
  sinan?: string;
  observations?: string | null;
}

export type UpdateNotificationOutput = Notification;
