export interface Permission {
  id: string;
  code: string;
  label: string;
  createdBy?: string | null;
  createdAt: Date;
  updatedBy?: string | null;
  updatedAt?: Date | null;
  deletedAt?: Date | null;
}
