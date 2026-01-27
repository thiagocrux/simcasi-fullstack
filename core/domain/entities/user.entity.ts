export interface User {
  id: string;
  name: string;
  email: string;
  password?: string; // Optional when returning from the repository for security
  roleId: string;
  createdBy?: string | null;
  updatedBy?: string | null;
  createdAt: Date;
  updatedAt?: Date | null;
  deletedAt?: Date | null;
}
