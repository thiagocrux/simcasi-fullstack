import { User } from '@/core/domain/entities/user.entity';
import { AuditMetadata } from '../common/audit-metadata.contract';

export interface RestoreUserInput extends AuditMetadata {
  id: string;
}

export interface RestoreUserOutput extends Omit<User, 'password'> {}
