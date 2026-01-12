export interface Notification {
  id: string;
  patientId: string;
  sinan: string;
  observations?: string | null;
  createdBy: string;
  createdAt: Date;
  updatedAt?: Date | null;
  deletedAt?: Date | null;
}
