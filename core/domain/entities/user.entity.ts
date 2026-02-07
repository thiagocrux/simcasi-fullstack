export interface User {
  id: string;
  name: string;
  email: string;
  password?: string; // Optional when returning from the repository for security.
  roleId: string;
  isSystem?: boolean; // True if this is a canonical system/internal user.
  createdBy?: string | null;
  createdAt: Date;
  updatedBy?: string | null;
  updatedAt?: Date | null;
  deletedAt?: Date | null;
}
