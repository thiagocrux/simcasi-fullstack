import { Exam } from '../entities/exam.entity';

/**
 * Repository interface for the Exam entity.
 * Manages patient laboratory tests and treponemal/non-treponemal results.
 */
export interface ExamRepository {
  /**
   * Finds an exam by ID, including soft-deleted ones if requested.
   *
   * @param id The exam ID.
   * @param includeDeleted Whether to include soft-deleted records.
   * @return The found exam or null.
   */
  findById(id: string, includeDeleted?: boolean): Promise<Exam | null>;

  /**
   * Lists all exams with pagination and filtering support.
   *
   * @param params Pagination and filtering parameters.
   * @return An object containing the list of exams and the total count.
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
  }): Promise<{ items: Exam[]; total: number }>;

  /**
   * Creates a new exam record.
   *
   * @param data Data for exam creation.
   * @return The created exam.
   */
  create(
    data: Omit<Exam, 'id' | 'createdAt' | 'updatedAt' | 'deletedAt'>
  ): Promise<Exam>;

  /**
   * Updates an existing exam record.
   *
   * @param id The exam ID.
   * @param data Data for exam update.
   * @param updatedBy ID from the user who performed the update.
   * @return The updated exam.
   */
  update(
    id: string,
    data: Partial<Omit<Exam, 'id' | 'createdAt'>>,
    updatedBy: string
  ): Promise<Exam>;

  /**
   * Performs a soft delete on a single exam.
   *
   * @param id The exam ID.
   * @param updatedBy ID from the user who performed the update.
   * @return A promise that resolves when the operation is complete.
   */
  softDelete(id: string, updatedBy: string): Promise<void>;

  /**
   * Performs a soft delete on all exams of a patient (cascade deletion).
   *
   * @param patientId The patient ID.
   * @param updatedBy ID from the user who performed the update.
   * @return A promise that resolves when the operation is complete.
   */
  softDeleteByPatientId(patientId: string, updatedBy: string): Promise<void>;

  /**
   * Restores a single soft-deleted exam.
   *
   * @param id The exam ID.
   * @param updatedBy ID from the user who performed the restoration.
   * @return A promise that resolves when the operation is complete.
   */
  restore(id: string, updatedBy: string): Promise<void>;

  /**
   * Restores a patient's exams deleted since a specific date.
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
