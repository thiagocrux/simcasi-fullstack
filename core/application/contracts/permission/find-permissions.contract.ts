import { Permission } from '@/core/domain/entities/permission.entity';
import { User } from '@/core/domain/entities/user.entity';

export interface FindPermissionsInput {
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

export interface FindPermissionsOutput {
  items: Permission[];
  total: number;
  relatedUsers?: User[];
}
