import { Permission } from '@/core/domain/entities/permission.entity';
import { AuditMetadata } from '../common/audit-metadata.contract';

export interface RegisterPermissionInput extends AuditMetadata {
  code: string;
}

export type RegisterPermissionOutput = Permission;
