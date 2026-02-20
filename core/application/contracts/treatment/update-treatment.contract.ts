import { Treatment } from '@/core/domain/entities/treatment.entity';

/**
 * Input parameters for updating an existing treatment.
 */
export interface UpdateTreatmentInput {
  /** Unique identifier of the treatment to update. */
  id: string;
  /** Medication name (optional). */
  medication?: string;
  /** Health center where treatment is performed (optional). */
  healthCenter?: string;
  /** Start date of the treatment (optional). */
  startDate?: Date | string;
  /** Dosage information (optional). */
  dosage?: string;
  /** Observations (optional). */
  observations?: string | null;
  /** Partner information (optional). */
  partnerInformation?: string | null;
}

/**
 * Output of the update treatment operation.
 * Returns the updated treatment entity.
 */
export type UpdateTreatmentOutput = Treatment;
