import { Notification } from '@/core/domain/entities/notification.entity';

/**
 * Input parameters for updating an existing notification.
 */
export interface UpdateNotificationInput {
  /** Unique identifier of the notification to update. */
  id: string;
  /** SINAN code (optional). */
  sinan?: string;
  /** Observations (optional). */
  observations?: string | null;
}

/**
 * Output of the update notification operation.
 * Returns the updated notification entity.
 */
export type UpdateNotificationOutput = Notification;
