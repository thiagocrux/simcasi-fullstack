import { User } from '@/core/domain/entities/user.entity';
import { AuditMetadata } from '../common/audit-metadata.contract';

export interface UpdateUserInput extends AuditMetadata {
  id: string;
  data: Partial<Omit<User, 'id' | 'createdAt' | 'updatedAt' | 'deletedAt'>>;
}

export interface UpdateUserOutput extends Omit<User, 'password'> {}
