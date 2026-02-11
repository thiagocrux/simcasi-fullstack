import { SYSTEM_CONSTANTS } from '@/core/domain/constants/system.constants';
import { NotFoundError } from '@/core/domain/errors/app.error';
import { AuditLogRepository } from '@/core/domain/repositories/audit-log.repository';
import { ObservationRepository } from '@/core/domain/repositories/observation.repository';
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
  constructor(
    private readonly observationRepository: ObservationRepository,
    private readonly auditLogRepository: AuditLogRepository
  ) {}

  async execute(
    input: DeleteObservationInput
  ): Promise<DeleteObservationOutput> {
    const { id, userId, ipAddress, userAgent } = input;

    // 1. Check if the observation exists.
    const observation = await this.observationRepository.findById(id);
    if (!observation) {
      throw new NotFoundError('Observation not found');
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
