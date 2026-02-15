import { SYSTEM_CONSTANTS } from '@/core/domain/constants/system.constants';
import { NotFoundError } from '@/core/domain/errors/app.error';
import { AuditLogRepository } from '@/core/domain/repositories/audit-log.repository';
import { TreatmentRepository } from '@/core/domain/repositories/treatment.repository';
import { getRequestContext } from '@/core/infrastructure/lib/request-context';
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
  /**
   * Creates an instance of DeleteTreatmentUseCase.
   * @param treatmentRepository The repository for treatment data operations.
   * @param auditLogRepository The repository for audit logging.
   */
  constructor(
    private readonly treatmentRepository: TreatmentRepository,
    private readonly auditLogRepository: AuditLogRepository
  ) {}

  /**
   * Executes the use case to soft delete a treatment.
   * @param input The ID of the treatment to delete.
   * @return A promise that resolves to the deleted treatment info.
   * @throws {NotFoundError} If the treatment is not found.
   */
  async execute(input: DeleteTreatmentInput): Promise<DeleteTreatmentOutput> {
    const { userId, ipAddress, userAgent } = getRequestContext();
    const { id } = input;

    // 1. Check if the treatment exists.
    const treatment = await this.treatmentRepository.findById(id);
    if (!treatment) {
      throw new NotFoundError('Tratamento');
    }

    // 2. Soft delete the treatment.
    await this.treatmentRepository.softDelete(
      id,
      userId ?? SYSTEM_CONSTANTS.DEFAULT_SYSTEM_USER_ID
    );

    // 3. Create audit log.
    await this.auditLogRepository.create({
      userId: userId ?? SYSTEM_CONSTANTS.DEFAULT_SYSTEM_USER_ID,
      action: 'DELETE',
      entityName: 'TREATMENT',
      entityId: id,
      oldValues: treatment,
      ipAddress,
      userAgent,
    });
  }
}
