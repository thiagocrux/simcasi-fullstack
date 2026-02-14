import { treatmentSchema } from '@/core/application/validation/schemas/treatment.schema';
import { formatZodError } from '@/core/application/validation/zod.utils';
import { SYSTEM_CONSTANTS } from '@/core/domain/constants/system.constants';
import { NotFoundError, ValidationError } from '@/core/domain/errors/app.error';
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
  /**
   * Creates an instance of UpdateTreatmentUseCase.
   * @param treatmentRepository The repository for treatment data operations.
   * @param auditLogRepository The repository for audit logging.
   */
  constructor(
    private readonly treatmentRepository: TreatmentRepository,
    private readonly auditLogRepository: AuditLogRepository
  ) {}

  /**
   * Executes the use case to update a treatment.
   * @param input The treatment update data and audit info.
   * @return A promise that resolves to the updated treatment.
   * @throws {ValidationError} If the update data is invalid.
   * @throws {NotFoundError} If the treatment is not found.
   */
  async execute(input: UpdateTreatmentInput): Promise<UpdateTreatmentOutput> {
    const { id, userId, ipAddress, userAgent, ...data } = input;

    // 1. Validate input.
    const validation = treatmentSchema.partial().safeParse(data);
    if (!validation.success) {
      throw new ValidationError(
        'Dados de atualização de tratamento inválidos.',
        formatZodError(validation.error)
      );
    }

    // 2. Check if the treatment exists.
    const existing = await this.treatmentRepository.findById(id);
    if (!existing) {
      throw new NotFoundError('Tratamento');
    }

    // 3. Update the treatment.
    const updatedTreatment = await this.treatmentRepository.update(
      id,
      {
        ...validation.data,
        startDate: validation.data.startDate
          ? new Date(validation.data.startDate)
          : undefined,
      },
      userId ?? SYSTEM_CONSTANTS.DEFAULT_SYSTEM_USER_ID
    );

    // 4. Create audit log.
    await this.auditLogRepository.create({
      userId: userId ?? SYSTEM_CONSTANTS.DEFAULT_SYSTEM_USER_ID,
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
