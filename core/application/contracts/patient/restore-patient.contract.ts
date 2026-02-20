import { Patient } from '@/core/domain/entities/patient.entity';

/** Input parameters for restoring a deleted patient. */
export interface RestorePatientInput {
  /** The unique identifier of the patient to restore. */
  id: string;
}

/** Output of the restore patient operation. */
export interface RestorePatientOutput extends Patient {}
