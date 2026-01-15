import { NotFoundError } from '@/core/domain/errors/app.error';
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
  constructor(private readonly observationRepository: ObservationRepository) {}

  async execute(
    input: DeleteObservationInput
  ): Promise<DeleteObservationOutput> {
    // 1. Check if the observation exists.
    const observation = await this.observationRepository.findById(input.id);
    if (!observation) {
      throw new NotFoundError('Observation not found');
    }

    // 2. Soft delete the observation.
    await this.observationRepository.softDelete(input.id);
  }
}
