export interface Notification {
  id: string;
  patientId: string;
  sinan: string;
  observations?: string | null;
  createdBy: string;
  updatedBy?: string | null;
  createdAt: Date;
  updatedAt?: Date | null;
  deletedAt?: Date | null;
}
