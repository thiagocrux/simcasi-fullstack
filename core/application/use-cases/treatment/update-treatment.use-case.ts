import { NotFoundError } from '@/core/domain/errors/app.error';
import { AuditLogRepository } from '@/core/domain/repositories/audit-log.repository';
import { TreatmentRepository } from '@/core/domain/repositories/treatment.repository';
import {
  UpdateTreatmentInput,
  UpdateTreatmentOutput,
} from '../../contracts/treatment/update-treatment.contract';
import { UseCase } from '../use-case.interface';

/**
 * Use case to update an existing treatment.
 */
export class UpdateTreatmentUseCase implements UseCase<
  UpdateTreatmentInput,
  UpdateTreatmentOutput
> {
  constructor(
    private readonly treatmentRepository: TreatmentRepository,
    private readonly auditLogRepository: AuditLogRepository
  ) {}

  async execute(input: UpdateTreatmentInput): Promise<UpdateTreatmentOutput> {
    const { id, updatedBy, ipAddress, userAgent, ...data } = input;

    // 1. Check if the treatment exists.
    const existing = await this.treatmentRepository.findById(id);
    if (!existing) {
      throw new NotFoundError('Treatment not found');
    }

    // 2. Update the treatment.
    const updatedTreatment = await this.treatmentRepository.update(id, data);

    // 3. Create audit log.
    await this.auditLogRepository.create({
      userId: updatedBy || 'SYSTEM',
      action: 'UPDATE',
      entityName: 'TREATMENT',
      entityId: id,
      oldValues: existing,
      newValues: updatedTreatment,
      ipAddress,
      userAgent,
    });

    return updatedTreatment;
  }
}
