import { Permission } from '@/core/domain/entities/permission.entity';

export interface FindPermissionsInput {
  skip?: number;
  take?: number;
  orderBy?: string;
  orderDir?: 'asc' | 'desc';
  search?: string;
  searchBy?: string;
  startDate?: Date;
  endDate?: Date;
  includeDeleted?: boolean;
}

export interface FindPermissionsOutput {
  items: Permission[];
  total: number;
}
