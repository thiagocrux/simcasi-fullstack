import { Notification } from '@/core/domain/entities/notification.entity';

/**
 * Input parameters for registering a new notification.
 */
export interface RegisterNotificationInput {
  /** Patient identifier. */
  patientId: string;
  /** SINAN code. */
  sinan: string;
  /** Observations (optional). */
  observations?: string | null;
}

/**
 * Output of the register notification operation.
 * Returns the created notification entity.
 */
export type RegisterNotificationOutput = Notification;
