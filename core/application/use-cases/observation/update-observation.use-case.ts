import { SYSTEM_CONSTANTS } from '@/core/domain/constants/system.constants';
import { NotFoundError } from '@/core/domain/errors/app.error';
import { AuditLogRepository } from '@/core/domain/repositories/audit-log.repository';
import { ObservationRepository } from '@/core/domain/repositories/observation.repository';
import {
  UpdateObservationInput,
  UpdateObservationOutput,
} from '../../contracts/observation/update-observation.contract';
import { UseCase } from '../use-case.interface';

/**
 * Use case to update an existing observation.
 */
export class UpdateObservationUseCase implements UseCase<
  UpdateObservationInput,
  UpdateObservationOutput
> {
  /**
   * Initializes a new instance of the UpdateObservationUseCase class.
   *
   * @param observationRepository The repository for observation persistence.
   * @param auditLogRepository The repository for audit logging.
   */
  constructor(
    private readonly observationRepository: ObservationRepository,
    private readonly auditLogRepository: AuditLogRepository
  ) {}

  /**
   * Executes the use case to update an existing observation.
   *
   * @param input The data to update the observation.
   * @return A promise that resolves to the updated observation.
   * @throws {NotFoundError} If the observation is not found.
   */
  async execute(
    input: UpdateObservationInput
  ): Promise<UpdateObservationOutput> {
    const { id, userId, ipAddress, userAgent, ...data } = input;

    // 1. Check if the observation exists.
    const existing = await this.observationRepository.findById(id);
    if (!existing) {
      throw new NotFoundError('Observação');
    }

    // 2. Update the observation.
    const updatedObservation = await this.observationRepository.update(
      id,
      {
        ...data,
      },
      userId ?? SYSTEM_CONSTANTS.DEFAULT_SYSTEM_USER_ID
    );

    // 3. Create audit log.
    await this.auditLogRepository.create({
      userId: userId ?? SYSTEM_CONSTANTS.DEFAULT_SYSTEM_USER_ID,
      action: 'UPDATE',
      entityName: 'OBSERVATION',
      entityId: id,
      oldValues: existing,
      newValues: updatedObservation,
      ipAddress,
      userAgent,
    });

    return updatedObservation;
  }
}
