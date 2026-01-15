import { Role } from '@/core/domain/entities/role.entity';
import { AuditMetadata } from '../common/audit-metadata.contract';

export interface UpdateRoleInput extends AuditMetadata {
  id: string;
  code?: string;
}

export type UpdateRoleOutput = Role;
