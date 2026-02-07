import { Patient } from '../entities/patient.entity';

export interface PatientRepository {
  /**
   * Searches for a patient by ID, including logically deleted ones if requested.
   */
  findById(id: string, includeDeleted?: boolean): Promise<Patient | null>;

  /**
   * Searches for a patient by CPF. Essential for the 'Restore' logic in case of duplicates.
   */
  findByCpf(cpf: string, includeDeleted?: boolean): Promise<Patient | null>;

  /**
   * Searches for a patient by SUS card number.
   */
  findBySusCardNumber(
    susCardNumber: string,
    includeDeleted?: boolean
  ): Promise<Patient | null>;

  /**
   * Lists patients with support for pagination and filtering.
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
   */
  create(
    data: Omit<Patient, 'id' | 'createdAt' | 'updatedAt' | 'deletedAt'>
  ): Promise<Patient>;

  /**
   * Updates data of an existing patient.
   */
  update(
    id: string,
    data: Partial<Omit<Patient, 'id' | 'createdAt'>>
  ): Promise<Patient>;

  /**
   * Searches for multiple patients by an array of IDs.
   */
  findByIds(ids: string[]): Promise<Patient[]>;

  /**
   * Executes Soft Delete (sets deletedAt).
   */
  softDelete(id: string): Promise<void>;

  /**
   * Restores a logically deleted patient (clears deletedAt).
   */
  restore(id: string, updatedBy: string): Promise<void>;
}
