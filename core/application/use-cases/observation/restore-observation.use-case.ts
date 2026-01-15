import { NotFoundError } from '@/core/domain/errors/app.error';
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
  constructor(private readonly observationRepository: ObservationRepository) {}

  async execute(
    input: RestoreObservationInput
  ): Promise<RestoreObservationOutput> {
    // 1. Check if the observation exists (including deleted).
    const observation = await this.observationRepository.findById(
      input.id,
      true
    );
    if (!observation) {
      throw new NotFoundError('Observation not found');
    }

    // 2. Perform the restoration if it was deleted.
    if (observation.deletedAt) {
      await this.observationRepository.restore(input.id);
    }

    return (await this.observationRepository.findById(
      input.id
    )) as RestoreObservationOutput;
  }
}
