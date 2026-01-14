import { Permission } from '@/core/domain/entities/permission.entity';

export interface FindPermissionsInput {
  skip?: number;
  take?: number;
  search?: string;
  includeDeleted?: boolean;
}

export interface FindPermissionsOutput {
  items: Permission[];
  total: number;
}
