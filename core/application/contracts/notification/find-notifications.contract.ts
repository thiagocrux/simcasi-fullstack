import { Notification } from '@/core/domain/entities/notification.entity';
import { Patient } from '@/core/domain/entities/patient.entity';
import { User } from '@/core/domain/entities/user.entity';

export interface FindNotificationsInput {
  skip?: number;
  take?: number;
  orderBy?: string;
  orderDir?: 'asc' | 'desc';
  search?: string;
  searchBy?: string;
  startDate?: string;
  endDate?: string;
  timezoneOffset?: string;
  patientId?: string;
  includeRelatedPatients?: boolean;
  includeRelatedUsers?: boolean;
  includeDeleted?: boolean;
}

export interface FindNotificationsOutput {
  items: Notification[];
  total: number;
  relatedPatients?: Patient[];
  relatedUsers?: User[];
}
