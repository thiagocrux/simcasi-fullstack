import { NotFoundError } from '@/core/domain/errors/app.error';
import { AuditLogRepository } from '@/core/domain/repositories/audit-log.repository';
import { TreatmentRepository } from '@/core/domain/repositories/treatment.repository';
import {
  DeleteTreatmentInput,
  DeleteTreatmentOutput,
} from '../../contracts/treatment/delete-treatment.contract';
import { UseCase } from '../use-case.interface';

/**
 * Use case to soft delete a treatment.
 */
export class DeleteTreatmentUseCase implements UseCase<
  DeleteTreatmentInput,
  DeleteTreatmentOutput
> {
  constructor(
    private readonly treatmentRepository: TreatmentRepository,
    private readonly auditLogRepository: AuditLogRepository
  ) {}

  async execute(input: DeleteTreatmentInput): Promise<DeleteTreatmentOutput> {
    const { id, deletedBy, ipAddress, userAgent } = input;

    // 1. Check if the treatment exists.
    const treatment = await this.treatmentRepository.findById(id);
    if (!treatment) {
      throw new NotFoundError('Treatment not found');
    }

    // 2. Soft delete the treatment.
    await this.treatmentRepository.softDelete(id);

    // 3. Create audit log.
    await this.auditLogRepository.create({
      userId: deletedBy || 'SYSTEM',
      action: 'DELETE',
      entityName: 'TREATMENT',
      entityId: id,
      oldValues: treatment,
      ipAddress,
      userAgent,
    });
  }
}
