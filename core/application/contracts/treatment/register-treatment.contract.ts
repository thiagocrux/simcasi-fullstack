import { Treatment } from '@/core/domain/entities/treatment.entity';

/**
 * Input parameters for registering a new treatment.
 */
export interface RegisterTreatmentInput {
  /** Patient identifier. */
  patientId: string;
  /** Medication name. */
  medication: string;
  /** Health center where treatment is performed. */
  healthCenter: string;
  /** Start date of the treatment. */
  startDate: Date | string;
  /** Dosage information. */
  dosage: string;
  /** Observations (optional). */
  observations?: string | null;
  /** Partner information (optional). */
  partnerInformation?: string | null;
}

/**
 * Output of the register treatment operation.
 * Returns the created treatment entity.
 */
export type RegisterTreatmentOutput = Treatment;
