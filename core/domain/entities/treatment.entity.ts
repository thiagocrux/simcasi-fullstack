export interface Treatment {
  id: string;
  patientId: string;
  medication: string;
  healthCenter: string;
  startDate: Date;
  dosage: string;
  observations?: string | null;
  partnerInformation?: string | null;
  createdBy: string;
  createdAt: Date;
  updatedBy?: string | null;
  updatedAt?: Date | null;
  deletedAt?: Date | null;
}
