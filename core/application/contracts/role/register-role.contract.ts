import { Role } from '@/core/domain/entities/role.entity';
import { AuditMetadata } from '../common/audit-metadata.contract';

export interface RegisterRoleInput extends AuditMetadata {
  code: string;
}

export type RegisterRoleOutput = Role;
