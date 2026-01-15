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
  constructor(
    private readonly observationRepository: ObservationRepository,
    private readonly auditLogRepository: AuditLogRepository
  ) {}

  async execute(
    input: UpdateObservationInput
  ): Promise<UpdateObservationOutput> {
    const { id, updatedBy, ipAddress, userAgent, ...data } = input;

    // 1. Check if the observation exists.
    const existing = await this.observationRepository.findById(id);
    if (!existing) {
      throw new NotFoundError('Observation not found');
    }

    // 2. Update the observation.
    const updatedObservation = await this.observationRepository.update(
      id,
      data
    );

    // 3. Create audit log.
    await this.auditLogRepository.create({
      userId: updatedBy || 'SYSTEM',
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
