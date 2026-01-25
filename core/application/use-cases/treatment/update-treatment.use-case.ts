import { treatmentSchema } from '@/core/application/validation/schemas/treatment.schema';
import { NotFoundError, ValidationError } from '@/core/domain/errors/app.error';
import { AuditLogRepository } from '@/core/domain/repositories/audit-log.repository';
import { TreatmentRepository } from '@/core/domain/repositories/treatment.repository';
import { formatZodError } from '@/core/application/validation/zod.utils';
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
    const { id, userId, ipAddress, userAgent, ...data } = input;

    // 1. Validate input.
    const validation = treatmentSchema.partial().safeParse(data);
    if (!validation.success) {
      throw new ValidationError(
        'Invalid update treatment data.',
        formatZodError(validation.error)
      );
    }

    // 2. Check if the treatment exists.
    const existing = await this.treatmentRepository.findById(id);
    if (!existing) {
      throw new NotFoundError('Treatment not found');
    }

    // 3. Update the treatment.
    const updatedTreatment = await this.treatmentRepository.update(id, {
      ...validation.data,
      startDate: validation.data.startDate
        ? new Date(validation.data.startDate)
        : undefined,
    });

    // 4. Create audit log.
    await this.auditLogRepository.create({
      userId: userId || 'SYSTEM',
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
