import { Role } from '@/core/domain/entities/role.entity';
import { AuditMetadata } from '../common/audit-metadata.contract';

export interface RestoreRoleInput extends AuditMetadata {
  id: string;
}

export type RestoreRoleOutput = Role;
