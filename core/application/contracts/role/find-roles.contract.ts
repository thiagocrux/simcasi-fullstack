import { Role } from '@/core/domain/entities/role.entity';

export interface FindRolesInput {
  skip?: number;
  take?: number;
  search?: string;
  includeDeleted?: boolean;
}

export interface FindRolesOutput {
  items: Role[];
  total: number;
}
