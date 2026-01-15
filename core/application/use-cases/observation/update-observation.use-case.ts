import { NotFoundError } from '@/core/domain/errors/app.error';
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
  constructor(private readonly observationRepository: ObservationRepository) {}

  async execute(
    input: UpdateObservationInput
  ): Promise<UpdateObservationOutput> {
    const { id, ...data } = input;

    // 1. Check if the observation exists.
    const observation = await this.observationRepository.findById(id);
    if (!observation) {
      throw new NotFoundError('Observation not found');
    }

    // 2. Update the observation.
    return this.observationRepository.update(id, data);
  }
}
