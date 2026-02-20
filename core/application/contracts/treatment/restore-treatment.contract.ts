import { Treatment } from '@/core/domain/entities/treatment.entity';

/**
 * Input parameters for restoring a treatment.
 */
export interface RestoreTreatmentInput {
  /** Unique identifier of the treatment to restore. */
  id: string;
}

/**
 * Output of the restore treatment operation.
 * Returns the restored treatment entity.
 */
export type RestoreTreatmentOutput = Treatment;
