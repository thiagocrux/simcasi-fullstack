import { SYSTEM_CONSTANTS } from '@/core/domain/constants/system.constants';
import { NotFoundError } from '@/core/domain/errors/app.error';
import { AuditLogRepository } from '@/core/domain/repositories/audit-log.repository';
import { ObservationRepository } from '@/core/domain/repositories/observation.repository';
import { getRequestContext } from '@/core/infrastructure/lib/request-context';
import {
  DeleteObservationInput,
  DeleteObservationOutput,
} from '../../contracts/observation/delete-observation.contract';
import { UseCase } from '../use-case.interface';

/**
 * Use case to soft delete an observation.
 */
export class DeleteObservationUseCase implements UseCase<
  DeleteObservationInput,
  DeleteObservationOutput
> {
  /**
   * Initializes a new instance of the DeleteObservationUseCase class.
   *
   * @param observationRepository The repository for observation persistence.
   * @param auditLogRepository The repository for audit logging.
   */
  constructor(
    private readonly observationRepository: ObservationRepository,
    private readonly auditLogRepository: AuditLogRepository
  ) {}

  /**
   * Executes the use case to soft delete an observation.
   *
   * @param input The data containing the observation ID.
   * @return A promise that resolves when the deletion is complete.
   * @throws {NotFoundError} If the observation is not found.
   */
  async execute(
    input: DeleteObservationInput
  ): Promise<DeleteObservationOutput> {
    const { userId, ipAddress, userAgent } = getRequestContext();
    const { id } = input;

    // 1. Check if the observation exists.
    const observation = await this.observationRepository.findById(id);
    if (!observation) {
      throw new NotFoundError('Observação');
    }

    // 2. Soft delete the observation.
    await this.observationRepository.softDelete(
      id,
      userId ?? SYSTEM_CONSTANTS.DEFAULT_SYSTEM_USER_ID
    );

    // 3. Create audit log.
    await this.auditLogRepository.create({
      userId: userId ?? SYSTEM_CONSTANTS.DEFAULT_SYSTEM_USER_ID,
      action: 'DELETE',
      entityName: 'OBSERVATION',
      entityId: id,
      oldValues: observation,
      ipAddress,
      userAgent,
    });
  }
}
