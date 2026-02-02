import { Notification } from '@/core/domain/entities/notification.entity';

export interface FindNotificationsInput {
  skip?: number;
  take?: number;
  orderBy?: string;
  orderDir?: 'asc' | 'desc';
  search?: string;
  searchBy?: string;
  startDate?: Date;
  endDate?: Date;
  patientId?: string;
  includeDeleted?: boolean;
}

export interface FindNotificationsOutput {
  items: Notification[];
  total: number;
}
