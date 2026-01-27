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
  updatedBy?: string | null;
  createdAt: Date;
  updatedAt?: Date | null;
  deletedAt?: Date | null;
}
