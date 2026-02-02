import { User } from '@/core/domain/entities/user.entity';

export interface FindUsersInput {
  skip?: number;
  take?: number;
  orderBy?: string;
  orderDir?: 'asc' | 'desc';
  search?: string;
  searchBy?: string;
  startDate?: Date;
  endDate?: Date;
  roleId?: string;
  includeDeleted?: boolean;
}

export interface FindUsersOutput {
  items: Omit<User, 'password'>[];
  total: number;
}
