import { Notification } from '@/core/domain/entities/notification.entity';

/**
 * Input parameters for restoring a notification.
 */
export interface RestoreNotificationInput {
  /** Unique identifier of the notification to restore. */
  id: string;
}

/**
 * Output of the restore notification operation.
 * Returns the restored notification entity.
 */
export type RestoreNotificationOutput = Notification;
