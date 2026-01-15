import { Permission } from '@/core/domain/entities/permission.entity';
import { AuditMetadata } from '../common/audit-metadata.contract';

export interface RestorePermissionInput extends AuditMetadata {
  id: string;
}

export type RestorePermissionOutput = Permission;
