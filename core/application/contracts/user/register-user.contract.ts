import { User } from '@/core/domain/entities/user.entity';
import { AuditMetadata } from '../common/audit-metadata.contract';

export interface RegisterUserInput
  extends
    Omit<User, 'id' | 'password' | 'createdAt' | 'updatedAt' | 'deletedAt'>,
    AuditMetadata {
  password: string;
}

export interface RegisterUserOutput extends Omit<User, 'password'> {}
