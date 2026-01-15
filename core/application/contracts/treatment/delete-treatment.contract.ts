export interface DeleteTreatmentInput {
  id: string;
  deletedBy?: string;
  ipAddress?: string;
  userAgent?: string;
}

export type DeleteTreatmentOutput = void;
