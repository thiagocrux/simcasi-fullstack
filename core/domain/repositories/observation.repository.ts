import { Observation } from '../entities/observation.entity';

/**
 * Repository interface for Observation entity.
 * Handles ad-hoc notes and clinical observations for patients.
 */
export interface ObservationRepository {
  /**
   * Searches for an observation by ID, including logically deleted ones if requested.
   */
  findById(id: string, includeDeleted?: boolean): Promise<Observation | null>;

  /**
   * Lists all observations with support for pagination and filtering.
   */
  findAll(params?: {
    skip?: number;
    take?: number;
    search?: string;
    patientId?: string;
    includeDeleted?: boolean;
  }): Promise<{ items: Observation[]; total: number }>;

  /**
   * Creates a new observation record.
   */
  create(
    data: Omit<Observation, 'id' | 'createdAt' | 'updatedAt' | 'deletedAt'>
  ): Promise<Observation>;

  /**
   * Updates an existing observation record.
   */
  update(
    id: string,
    data: Partial<Omit<Observation, 'id' | 'createdAt'>>
  ): Promise<Observation>;

  /**
   * Executes Soft Delete on a single observation.
   */
  softDelete(id: string): Promise<void>;

  /**
   * Executes Soft Delete on all observations of a patient (cascade deletion).
   */
  softDeleteByPatientId(patientId: string): Promise<void>;

  /**
   * Restores a single logically deleted observation.
   */
  restore(id: string): Promise<void>;

  /**
   * Restores observations of a patient deleted since a specific date (cascade restoration).
   */
  restoreByPatientId(patientId: string, since: Date): Promise<void>;
}
