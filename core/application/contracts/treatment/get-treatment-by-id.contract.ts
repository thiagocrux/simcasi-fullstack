import { Treatment } from '@/core/domain/entities/treatment.entity';

/**
 * Input parameters for retrieving a treatment by ID.
 */
export interface GetTreatmentByIdInput {
  /** Unique identifier of the treatment to retrieve. */
  id: string;
}

/**
 * Output of the get treatment by ID operation.
 * Returns the treatment entity.
 */
export type GetTreatmentByIdOutput = Treatment;
