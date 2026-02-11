import { Observation } from '../entities/observation.entity';

/**
 * Repository interface for the Observation entity.
 * Manages ad-hoc notes and clinical observations for patients.
 */
export interface ObservationRepository {
  /**
   * Finds an observation by ID, including soft-deleted ones if requested.
   *
   * @param id The observation ID.
   * @param includeDeleted Whether to include soft-deleted records.
   * @return The found observation or null.
   */
  findById(id: string, includeDeleted?: boolean): Promise<Observation | null>;

  /**
   * Lists all observations with pagination and filtering support.
   *
   * @param params Pagination and filtering parameters.
   * @return An object containing the list of observations and the total count.
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
  }): Promise<{ items: Observation[]; total: number }>;

  /**
   * Creates a new observation record.
   *
   * @param data Data for observation creation.
   * @return The created observation.
   */
  create(
    data: Omit<Observation, 'id' | 'createdAt' | 'updatedAt' | 'deletedAt'>
  ): Promise<Observation>;

  /**
   * Updates an existing observation record.
   *
   * @param id The observation ID.
   * @param data Data for observation update.
   * @param updatedBy User who performed the update.
   * @return The updated observation.
   */
  update(
    id: string,
    data: Partial<Omit<Observation, 'id' | 'createdAt'>>,
    updatedBy: string
  ): Promise<Observation>;

  /**
   * Performs a soft delete on a single observation.
   *
   * @param id The observation ID.
   * @param updatedBy ID from the user who performed the update.
   * @return A promise that resolves when the operation is complete.
   */
  softDelete(id: string, updatedBy: string): Promise<void>;

  /**
   * Performs a soft delete on all observations of a patient (cascade deletion).
   *
   * @param patientId The patient ID.
   * @param updatedBy ID from the user who performed the update.
   * @return A promise that resolves when the operation is complete.
   */
  softDeleteByPatientId(patientId: string, updatedBy: string): Promise<void>;

  /**
   * Restores a single soft-deleted observation.
   *
   * @param id The observation ID.
   * @param updatedBy ID from the user who performed the restoration.
   * @return A promise that resolves when the operation is complete.
   */
  restore(id: string, updatedBy: string): Promise<void>;

  /**
   * Restores a patient's observations deleted since a specific date.
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
