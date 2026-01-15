import { Permission } from '@/core/domain/entities/permission.entity';
import { AuditMetadata } from '../common/audit-metadata.contract';

export interface UpdatePermissionInput extends AuditMetadata {
  id: string;
  code?: string;
}

export type UpdatePermissionOutput = Permission;
