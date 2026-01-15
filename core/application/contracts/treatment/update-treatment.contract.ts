import { Treatment } from '@/core/domain/entities/treatment.entity';

export interface UpdateTreatmentInput {
  id: string;
  medication?: string;
  healthCenter?: string;
  startDate?: Date;
  dosage?: string;
  observations?: string | null;
  partnerInformation?: string | null;
  updatedBy?: string;
  ipAddress?: string;
  userAgent?: string;
}

export type UpdateTreatmentOutput = Treatment;
