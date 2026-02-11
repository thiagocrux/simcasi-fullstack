import { Treatment } from '../entities/treatment.entity';

/**
 * Repository interface for the Treatment entity.
 * Manages the monitoring of medications, dosages, and partner information.
 */
export interface TreatmentRepository {
  /**
   * Finds a treatment by ID, including soft-deleted ones if requested.
   *
   * @param id The treatment ID.
   * @param includeDeleted Whether to include soft-deleted records.
   * @return The found treatment or null.
   */
  findById(id: string, includeDeleted?: boolean): Promise<Treatment | null>;

  /**
   * Lists all treatments with pagination and filtering support.
   *
   * @param params Pagination and filtering parameters.
   * @return An object containing the list of treatments and the total count.
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
  }): Promise<{ items: Treatment[]; total: number }>;

  /**
   * Creates a new treatment record.
   *
   * @param data Data for treatment creation.
   * @return The created treatment.
   */
  create(
    data: Omit<Treatment, 'id' | 'createdAt' | 'updatedAt' | 'deletedAt'>
  ): Promise<Treatment>;

  /**
   * Updates an existing treatment record.
   *
   * @param id The treatment ID.
   * @param data Data for treatment update.
   * @param updatedBy User who performed the update.
   * @return The updated treatment.
   */
  update(
    id: string,
    data: Partial<Omit<Treatment, 'id' | 'createdAt'>>,
    updatedBy: string
  ): Promise<Treatment>;

  /**
   * Performs a soft delete on a single treatment.
   *
   * @param id The treatment ID.
   * @param updatedBy ID from the user who performed the update.
   * @return A promise that resolves when the operation is complete.
   */
  softDelete(id: string, updatedBy: string): Promise<void>;

  /**
   * Performs a soft delete on all treatments of a patient (cascade deletion).
   *
   * @param patientId The patient ID.
   * @param updatedBy ID from the user who performed the update.
   * @return A promise that resolves when the operation is complete.
   */
  softDeleteByPatientId(patientId: string, updatedBy: string): Promise<void>;

  /**
   * Restores a single soft-deleted treatment.
   *
   * @param id The treatment ID.
   * @param updatedBy ID from the user who performed the restoration.
   * @return A promise that resolves when the operation is complete.
   */
  restore(id: string, updatedBy: string): Promise<void>;

  /**
   * Restores a patient's treatments deleted since a specific date.
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
