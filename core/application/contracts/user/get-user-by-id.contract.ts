import { User } from '@/core/domain/entities/user.entity';

export interface GetUserInput {
  id: string;
  includeDeleted?: boolean;
}

export interface GetUserOutput extends Omit<User, 'password'> {}
