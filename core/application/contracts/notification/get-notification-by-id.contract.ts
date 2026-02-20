import { Notification } from '@/core/domain/entities/notification.entity';

/**
 * Input parameters for retrieving a notification by ID.
 */
export interface GetNotificationByIdInput {
  /** Unique identifier of the notification to retrieve. */
  id: string;
}

/**
 * Output of the get notification by ID operation.
 * Returns the notification entity.
 */
export type GetNotificationByIdOutput = Notification;
