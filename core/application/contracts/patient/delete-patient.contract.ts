/** Input parameters for deleting a patient. */
export interface DeletePatientInput {
  /** The unique identifier of the patient to delete. */
  id: string;
}

/** Output of the delete patient operation. */
export type DeletePatientOutput = void;
