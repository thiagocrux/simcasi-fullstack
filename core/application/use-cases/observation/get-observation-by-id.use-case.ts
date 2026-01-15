import { NotFoundError } from '@/core/domain/errors/app.error';
import { ObservationRepository } from '@/core/domain/repositories/observation.repository';
import {
  GetObservationByIdInput,
  GetObservationByIdOutput,
} from '../../contracts/observation/get-observation-by-id.contract';
import { UseCase } from '../use-case.interface';

/**
 * Use case to retrieve an observation by ID.
 */
export class GetObservationByIdUseCase implements UseCase<
  GetObservationByIdInput,
  GetObservationByIdOutput
> {
  constructor(private readonly observationRepository: ObservationRepository) {}

  async execute(
    input: GetObservationByIdInput
  ): Promise<GetObservationByIdOutput> {
    // 1. Find the observation by ID.
    const observation = await this.observationRepository.findById(input.id);
    if (!observation) {
      throw new NotFoundError('Observation not found');
    }

    return observation;
  }
}
