import { Notification } from '@/core/domain/entities/notification.entity';

export interface GetNotificationByIdInput {
  id: string;
}

export type GetNotificationByIdOutput = Notification;
