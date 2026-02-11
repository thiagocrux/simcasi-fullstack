import { Notification } from '../entities/notification.entity';

/**
 * Repository interface for the Notification entity.
 * Manages epidemiological notifications (e.g., SINAN).
 */
export interface NotificationRepository {
  /**
   * Finds a notification by ID, including soft-deleted ones if requested.
   *
   * @param id The notification ID.
   * @param includeDeleted Whether to include soft-deleted records.
   * @return The found notification or null.
   */
  findById(id: string, includeDeleted?: boolean): Promise<Notification | null>;

  /**
   * Lists all notifications with pagination and filtering support.
   *
   * @param params Pagination and filtering parameters.
   * @return An object containing the list of notifications and the total count.
   */
  findAll(params?: {
    skip?: number;
    take?: number;
    orderBy?: string;
    orderDir?: 'asc' | 'desc';
    search?: string;
    searchBy?: string;
    startDate?: string;
    endDate?: string;
    timezoneOffset?: string;
    patientId?: string;
    includeDeleted?: boolean;
  }): Promise<{ items: Notification[]; total: number }>;

  /**
   * Creates a new notification record.
   *
   * @param data Data for notification creation.
   * @return The created notification.
   */
  create(
    data: Omit<Notification, 'id' | 'createdAt' | 'updatedAt' | 'deletedAt'>
  ): Promise<Notification>;

  /**
   * Updates an existing notification record.
   *
   * @param id The notification ID.
   * @param data Data for notification update.
   * @param updatedBy User who performed the update.
   * @return The updated notification.
   */
  update(
    id: string,
    data: Partial<Omit<Notification, 'id' | 'createdAt'>>,
    updatedBy: string
  ): Promise<Notification>;

  /**
   * Performs a soft delete on a single notification.
   *
   * @param id The notification ID.
   * @param updatedBy ID from the user who performed the update.
   * @return A promise that resolves when the operation is complete.
   */
  softDelete(id: string, updatedBy: string): Promise<void>;

  /**
   * Performs a soft delete on all notifications of a patient (cascade deletion).
   *
   * @param patientId The patient ID.
   * @param updatedBy ID from the user who performed the update.
   * @return A promise that resolves when the operation is complete.
   */
  softDeleteByPatientId(patientId: string, updatedBy: string): Promise<void>;

  /**
   * Restores a single soft-deleted notification.
   *
   * @param id The notification ID.
   * @param updatedBy ID from the user who performed the restoration.
   * @return A promise that resolves when the operation is complete.
   */
  restore(id: string, updatedBy: string): Promise<void>;

  /**
   * Restores a patient's notifications deleted since a specific date.
   *
   * @param patientId The patient ID.
   * @param updatedBy ID from the user who performed the restoration.
   * @param since Optional date to filter the restoration.
   * @return A promise that resolves when the operation is complete.
   */
  restoreByPatientId(
    patientId: string,
    updatedBy: string,
    since?: Date
  ): Promise<void>;
}
