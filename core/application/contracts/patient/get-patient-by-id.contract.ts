import { Patient } from '@/core/domain/entities/patient.entity';

/** Input parameters for getting a patient by ID. */
export interface GetPatientInput {
  /** The unique identifier of the patient. */
  id: string;
  /** Whether to check including soft-deleted records. */
  includeDeleted?: boolean;
}

/** Output of the get patient operation. */
export interface GetPatientOutput extends Patient {}
