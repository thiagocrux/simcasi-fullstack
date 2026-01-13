import { Notification } from '../entities/notification.entity';

/**
 * Repository interface for Notification entity.
 * Handles epidemiological notifications (e.g., SINAN).
 */
export interface NotificationRepository {
  /**
   * Searches for a notification by ID, including logically deleted ones if requested.
   */
  findById(id: string, includeDeleted?: boolean): Promise<Notification | null>;

  /**
   * Lists all notifications with support for pagination and filtering.
   */
  findAll(params?: {
    skip?: number;
    take?: number;
    search?: string;
    patientId?: string;
    includeDeleted?: boolean;
  }): Promise<{ items: Notification[]; total: number }>;

  /**
   * Creates a new notification record.
   */
  create(
    data: Omit<Notification, 'id' | 'createdAt' | 'updatedAt' | 'deletedAt'>
  ): Promise<Notification>;

  /**
   * Updates an existing notification record.
   */
  update(
    id: string,
    data: Partial<Omit<Notification, 'id' | 'createdAt'>>
  ): Promise<Notification>;

  /**
   * Executes Soft Delete on a single notification.
   */
  softDelete(id: string): Promise<void>;

  /**
   * Executes Soft Delete on all notifications of a patient (cascade deletion).
   */
  softDeleteByPatientId(patientId: string): Promise<void>;

  /**
   * Restores a single logically deleted notification.
   */
  restore(id: string): Promise<void>;

  /**
   * Restores notifications of a patient deleted since a specific date (cascade restoration).
   */
  restoreByPatientId(patientId: string, since: Date): Promise<void>;
}
