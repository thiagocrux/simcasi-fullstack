import { Permission } from '@/core/domain/entities/permission.entity';
import { AuditMetadata } from '../common/audit-metadata.contract';

export interface UpdatePermissionInput extends AuditMetadata {
  id: string;
  code?: string;
  /**
   * Optional array of Role IDs to manage the many-to-many relationship.
   * Sending this will synchronize associations by replacing existing ones.
   */
  roleIds?: string[];
}

export type UpdatePermissionOutput = Permission;
