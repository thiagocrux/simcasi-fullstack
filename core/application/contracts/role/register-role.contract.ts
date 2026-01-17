import { Role } from '@/core/domain/entities/role.entity';
import { AuditMetadata } from '../common/audit-metadata.contract';

export interface RegisterRoleInput extends AuditMetadata {
  code: string;
  /**
   * Optional array of Permission IDs to manage the many-to-many relationship.
   * This property is used by the infrastructure layer to synchronize associations.
   */
  permissionIds?: string[];
}

export type RegisterRoleOutput = Role;
