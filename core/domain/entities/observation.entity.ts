export interface Observation {
  id: string;
  patientId: string;
  observations?: string | null;
  hasPartnerBeingTreated: boolean;
  createdBy: string;
  createdAt: Date;
  updatedAt?: Date | null;
  deletedAt?: Date | null;
}
