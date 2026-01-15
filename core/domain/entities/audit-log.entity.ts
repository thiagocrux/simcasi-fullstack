export interface AuditLog {
  id: string;
  userId: string;
  action: string;
  entityName: string;
  entityId: string;
  oldValues?: unknown;
  newValues?: unknown;
  ipAddress?: string | null;
  userAgent?: string | null;
  createdAt: Date;
}
