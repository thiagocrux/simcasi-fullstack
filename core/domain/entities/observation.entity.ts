export interface Observation {
  id: string;
  patientId: string;
  observations?: string | null;
  hasPartnerBeingTreated: boolean;
  createdBy: string;
  createdAt: Date;
  updatedBy?: string | null;
  updatedAt?: Date | null;
  deletedAt?: Date | null;
}
