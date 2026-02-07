export interface Notification {
  id: string;
  patientId: string;
  sinan: string;
  observations?: string | null;
  createdBy: string;
  createdAt: Date;
  updatedBy?: string | null;
  updatedAt?: Date | null;
  deletedAt?: Date | null;
}
