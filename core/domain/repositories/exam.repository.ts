import { Exam } from '../entities/exam.entity';

/**
 * Repository interface for Exam entity.
 * Handles patient laboratory tests and treponemal/nontreponemal results.
 */
export interface ExamRepository {
  /**
   * Searches for an exam by ID, including logically deleted ones if requested.
   */
  findById(id: string, includeDeleted?: boolean): Promise<Exam | null>;

  /**
   * Retrieves all exams associated with a specific patient.
   */
  findByPatientId(
    patientId: string,
    params?: { skip?: number; take?: number; includeDeleted?: boolean }
  ): Promise<{ items: Exam[]; total: number }>;

  /**
   * Lists all exams with support for pagination.
   */
  findAll(params?: {
    skip?: number;
    take?: number;
    includeDeleted?: boolean;
  }): Promise<{ items: Exam[]; total: number }>;

  /**
   * Creates a new exam record.
   */
  create(
    data: Omit<Exam, 'id' | 'createdAt' | 'updatedAt' | 'deletedAt'>
  ): Promise<Exam>;

  /**
   * Updates an existing exam record.
   */
  update(
    id: string,
    data: Partial<Omit<Exam, 'id' | 'createdAt'>>
  ): Promise<Exam>;

  /**
   * Executes Soft Delete on a single exam.
   */
  softDelete(id: string): Promise<void>;

  /**
   * Executes Soft Delete on all exams of a patient (cascade deletion).
   */
  softDeleteByPatientId(patientId: string): Promise<void>;

  /**
   * Restores a single logically deleted exam.
   */
  restore(id: string): Promise<void>;

  /**
   * Restores exams of a patient deleted since a specific date (cascade restoration).
   */
  restoreByPatientId(patientId: string, since: Date): Promise<void>;
}
