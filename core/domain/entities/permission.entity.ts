export interface Permission {
  id: string;
  code: string;
  createdAt: Date;
  updatedAt?: Date | null;
  deletedAt?: Date | null;
}
