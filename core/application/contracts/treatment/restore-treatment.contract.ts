import { Treatment } from '@/core/domain/entities/treatment.entity';

export interface RestoreTreatmentInput {
  id: string;
  restoredBy?: string;
  ipAddress?: string;
  userAgent?: string;
}

export type RestoreTreatmentOutput = Treatment;
