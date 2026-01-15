export interface DeletePatientInput {
  id: string;
  deletedBy?: string;
  ipAddress?: string;
  userAgent?: string;
}

export type DeletePatientOutput = void;
