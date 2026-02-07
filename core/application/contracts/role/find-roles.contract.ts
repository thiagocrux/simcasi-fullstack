import { Role } from '@/core/domain/entities/role.entity';
import { User } from '@/core/domain/entities/user.entity';

export interface FindRolesInput {
  skip?: number;
  take?: number;
  orderBy?: string;
  orderDir?: 'asc' | 'desc';
  search?: string;
  searchBy?: string;
  startDate?: string;
  endDate?: string;
  timezoneOffset?: string;
  includeRelatedUsers?: boolean;
  includeDeleted?: boolean;
}

export interface FindRolesOutput {
  items: Role[];
  total: number;
  relatedUsers?: User[];
}
