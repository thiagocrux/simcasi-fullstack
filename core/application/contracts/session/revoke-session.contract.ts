export interface RevokeSessionInput {
  id: string;
  revokedBy?: string;
  ipAddress?: string;
  userAgent?: string;
}

export interface RevokeSessionOutput {
  success: boolean;
}
