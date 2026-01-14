import { Notification } from '@/core/domain/entities/notification.entity';

export interface FindNotificationsInput {
  skip?: number;
  take?: number;
  search?: string;
  patientId?: string;
  includeDeleted?: boolean;
}

export interface FindNotificationsOutput {
  items: Notification[];
  total: number;
}
