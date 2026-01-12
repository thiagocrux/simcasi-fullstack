export interface Session {
  id: string;
  userId: string;
  issuedAt: Date;
  expiresAt: Date;
  ipAddress: string;
  userAgent: string;
  createdAt: Date;
  updatedAt?: Date | null;
  deletedAt?: Date | null;
}
