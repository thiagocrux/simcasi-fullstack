import { AuditLog } from '@/core/domain/entities/audit-log.entity';

export interface FindAuditLogsInput {
  skip?: number;
  take?: number;
  search?: string;
  userId?: string;
  action?: string;
  entityName?: string;
  entityId?: string;
  orderBy?: string;
  orderDir?: 'asc' | 'desc';
  startDate?: Date;
  endDate?: Date;
}

export interface FindAuditLogsOutput {
  items: AuditLog[];
  total: number;
}
