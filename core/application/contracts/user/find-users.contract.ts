import { User } from '@/core/domain/entities/user.entity';

export interface FindUsersInput {
  skip?: number;
  take?: number;
  orderBy?: string;
  orderDir?: 'asc' | 'desc';
  search?: string;
  includeDeleted?: boolean;
  roleId?: string;
}

export interface FindUsersOutput {
  items: Omit<User, 'password'>[];
  total: number;
}
