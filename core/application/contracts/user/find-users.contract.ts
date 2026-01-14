import { User } from '@/core/domain/entities/user.entity';

export interface FindUsersInput {
  skip?: number;
  take?: number;
  search?: string;
  roleId?: string;
  includeDeleted?: boolean;
}

export interface FindUsersOutput {
  items: Omit<User, 'password'>[];
  total: number;
}
