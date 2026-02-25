import { SYSTEM_CONSTANTS } from '@/core/domain/constants/system.constants';
import { NotFoundError } from '@/core/domain/errors/app.error';
import { AuditLogRepository } from '@/core/domain/repositories/audit-log.repository';
import { TreatmentRepository } from '@/core/domain/repositories/treatment.repository';
import { getRequestContext } from '@/core/infrastructure/lib/request-context';
import {
  RestoreTreatmentInput,
  RestoreTreatmentOutput,
} from '../../contracts/treatment/restore-treatment.contract';
import { UseCase } from '../use-case.interface';

/**
 * Use case to restore a soft-deleted treatment.
 */
export class RestoreTreatmentUseCase implements UseCase<
  RestoreTreatmentInput,
  RestoreTreatmentOutput
> {
  /**
   * Creates an instance of RestoreTreatmentUseCase.
   * @param treatmentRepository The repository for treatment data operations.
   * @param auditLogRepository The repository for audit logging.
   */
  constructor(
    private readonly treatmentRepository: TreatmentRepository,
    private readonly auditLogRepository: AuditLogRepository
  ) {}

  /**
   * Executes the use case to restore a soft-deleted treatment.
   * @param input The ID of the treatment to restore.
   * @return A promise that resolves to the restored treatment.
   * @throws {NotFoundError} If the treatment is not found.
   */
  async execute(input: RestoreTreatmentInput): Promise<RestoreTreatmentOutput> {
    const { userId, ipAddress, userAgent } = getRequestContext();
    const { id } = input;

    // 1. Check if the treatment exists (including deleted).
    const existingTreatment = await this.treatmentRepository.findById(id, true);
    if (!existingTreatment) {
      throw new NotFoundError('Tratamento');
    }

    // 2. Perform the restoration if it was deleted.
    if (existingTreatment.deletedAt) {
      await this.treatmentRepository.restore(
        id,
        userId ?? SYSTEM_CONSTANTS.DEFAULT_SYSTEM_USER_ID
      );
      existingTreatment.deletedAt = null;
      existingTreatment.updatedBy =
        userId ?? SYSTEM_CONSTANTS.DEFAULT_SYSTEM_USER_ID;

      // 3. Create audit log.
      await this.auditLogRepository.create({
        userId: userId ?? SYSTEM_CONSTANTS.DEFAULT_SYSTEM_USER_ID,
        action: 'RESTORE',
        entityName: 'TREATMENT',
        entityId: id,
        newValues: JSON.parse(JSON.stringify(existingTreatment)),
        ipAddress,
        userAgent,
      });
    }

    return existingTreatment as RestoreTreatmentOutput;
  }
}
