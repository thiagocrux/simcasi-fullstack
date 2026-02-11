import { Patient } from '../entities/patient.entity';

/**
 * Repository interface for the Patient entity.
 * Manages the lifecycle of patient data.
 */
export interface PatientRepository {
  /**
   * Finds a patient by ID, including soft-deleted ones if requested.
   *
   * @param id The patient ID.
   * @param includeDeleted Whether to include soft-deleted records.
   * @return The found patient or null.
   */
  findById(id: string, includeDeleted?: boolean): Promise<Patient | null>;

  /**
   * Finds a patient by CPF. Essential for 'Restore' logic in case of duplicates.
   *
   * @param cpf The patient's CPF.
   * @param includeDeleted Whether to include soft-deleted records.
   * @return The found patient or null.
   */
  findByCpf(cpf: string, includeDeleted?: boolean): Promise<Patient | null>;

  /**
   * Finds a patient by SUS card number.
   *
   * @param susCardNumber The SUS card number.
   * @param includeDeleted Whether to include soft-deleted records.
   * @return The found patient or null.
   */
  findBySusCardNumber(
    susCardNumber: string,
    includeDeleted?: boolean
  ): Promise<Patient | null>;

  /**
   * Lists patients with pagination and filtering support.
   *
   * @param params Pagination and filtering parameters.
   * @return An object containing the list of patients and the total count.
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
    includeDeleted?: boolean;
  }): Promise<{ items: Patient[]; total: number }>;

  /**
   * Creates a new patient record.
   *
   * @param data Data for patient creation.
   * @return The created patient.
   */
  create(
    data: Omit<Patient, 'id' | 'createdAt' | 'updatedAt' | 'deletedAt'>
  ): Promise<Patient>;

  /**
   * Updates data of an existing patient.
   *
   * @param id The patient ID.
   * @param data Data for patient update.
   * @param updatedBy User who performed the update.
   * @return The updated patient.
   */
  update(
    id: string,
    data: Partial<Omit<Patient, 'id' | 'createdAt'>>,
    updatedBy: string
  ): Promise<Patient>;

  /**
   * Finds multiple patients by an array of IDs.
   *
   * @param ids List of patient IDs.
   * @return List of found patients.
   */
  findByIds(ids: string[]): Promise<Patient[]>;

  /**
   * Performs a soft delete.
   *
   * @param id The patient ID.
   * @param updatedBy ID from the user who performed the update.
   * @return A promise that resolves when the operation is complete.
   */
  softDelete(id: string, updatedBy: string): Promise<void>;

  /**
   * Restores a soft-deleted patient.
   *
   * @param id The patient ID.
   * @param updatedBy ID from the user who performed the restoration.
   * @return A promise that resolves when the operation is complete.
   */
  restore(id: string, updatedBy: string): Promise<void>;
}
