import { Permission } from '@/core/domain/entities/permission.entity';

export interface FindPermissionsInput {
  skip?: number;
  take?: number;
  search?: string;
  includeDeleted?: boolean;
  orderBy?: string;
  orderDir?: 'asc' | 'desc';
}

export interface FindPermissionsOutput {
  items: Permission[];
  total: number;
}
