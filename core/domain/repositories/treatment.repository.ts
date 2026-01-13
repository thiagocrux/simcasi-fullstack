import { Treatment } from '../entities/treatment.entity';

/**
 * Repository interface for Treatment entity.
 * Handles medication tracking, dosages, and partnership information.
 */
export interface TreatmentRepository {
  /**
   * Searches for a treatment by ID, including logically deleted ones if requested.
   */
  findById(id: string, includeDeleted?: boolean): Promise<Treatment | null>;

  /**
   * Lists all treatments with support for pagination and filtering.
   */
  findAll(params?: {
    skip?: number;
    take?: number;
    search?: string;
    patientId?: string;
    includeDeleted?: boolean;
  }): Promise<{ items: Treatment[]; total: number }>;

  /**
   * Creates a new treatment record.
   */
  create(
    data: Omit<Treatment, 'id' | 'createdAt' | 'updatedAt' | 'deletedAt'>
  ): Promise<Treatment>;

  /**
   * Updates an existing treatment record.
   */
  update(
    id: string,
    data: Partial<Omit<Treatment, 'id' | 'createdAt'>>
  ): Promise<Treatment>;

  /**
   * Executes Soft Delete on a single treatment.
   */
  softDelete(id: string): Promise<void>;

  /**
   * Executes Soft Delete on all treatments of a patient (cascade deletion).
   */
  softDeleteByPatientId(patientId: string): Promise<void>;

  /**
   * Restores a single logically deleted treatment.
   */
  restore(id: string): Promise<void>;

  /**
   * Restores treatments of a patient deleted since a specific date (cascade restoration).
   */
  restoreByPatientId(patientId: string, since: Date): Promise<void>;
}
