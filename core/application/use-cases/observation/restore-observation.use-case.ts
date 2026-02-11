import { SYSTEM_CONSTANTS } from '@/core/domain/constants/system.constants';
import { NotFoundError } from '@/core/domain/errors/app.error';
import { AuditLogRepository } from '@/core/domain/repositories/audit-log.repository';
import { ObservationRepository } from '@/core/domain/repositories/observation.repository';
import {
  RestoreObservationInput,
  RestoreObservationOutput,
} from '../../contracts/observation/restore-observation.contract';
import { UseCase } from '../use-case.interface';

/**
 * Use case to restore a soft-deleted observation.
 */
export class RestoreObservationUseCase implements UseCase<
  RestoreObservationInput,
  RestoreObservationOutput
> {
  /**
   * Initializes a new instance of the RestoreObservationUseCase class.
   *
   * @param observationRepository The repository for observation persistence.
   * @param auditLogRepository The repository for audit logging.
   */
  constructor(
    private readonly observationRepository: ObservationRepository,
    private readonly auditLogRepository: AuditLogRepository
  ) {}

  /**
   * Executes the use case to restore a soft-deleted observation.
   *
   * @param input The data containing the observation ID and auditor info.
   * @return A promise that resolves to the restored observation.
   * @throws {NotFoundError} If the observation is not found.
   */
  async execute(
    input: RestoreObservationInput
  ): Promise<RestoreObservationOutput> {
    const { id, userId, ipAddress, userAgent } = input;

    // 1. Check if the observation exists (including deleted).
    const observation = await this.observationRepository.findById(id, true);
    if (!observation) {
      throw new NotFoundError('Observation not found');
    }

    // 2. Perform the restoration if it was deleted.
    if (observation.deletedAt) {
      await this.observationRepository.restore(
        id,
        userId ?? SYSTEM_CONSTANTS.DEFAULT_SYSTEM_USER_ID
      );
      observation.deletedAt = null;
      observation.updatedBy = userId ?? SYSTEM_CONSTANTS.DEFAULT_SYSTEM_USER_ID;

      // 3. Create audit log.
      await this.auditLogRepository.create({
        userId: userId ?? SYSTEM_CONSTANTS.DEFAULT_SYSTEM_USER_ID,
        action: 'RESTORE',
        entityName: 'OBSERVATION',
        entityId: id,
        newValues: observation,
        ipAddress,
        userAgent,
      });
    }

    return observation as RestoreObservationOutput;
  }
}
