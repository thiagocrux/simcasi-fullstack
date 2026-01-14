import { User } from '@/core/domain/entities/user.entity';

export interface UpdateUserInput {
  id: string;
  data: Partial<Omit<User, 'id' | 'createdAt' | 'updatedAt' | 'deletedAt'>>;
}

export interface UpdateUserOutput extends Omit<User, 'password'> {}
