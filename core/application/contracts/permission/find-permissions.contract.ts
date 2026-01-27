import { Permission } from '@/core/domain/entities/permission.entity';

export interface FindPermissionsInput {
  skip?: number;
  take?: number;
  orderBy?: string;
  orderDir?: 'asc' | 'desc';
  startDate?: Date;
  endDate?: Date;
  search?: string;
  includeDeleted?: boolean;
}

export interface FindPermissionsOutput {
  items: Permission[];
  total: number;
}
