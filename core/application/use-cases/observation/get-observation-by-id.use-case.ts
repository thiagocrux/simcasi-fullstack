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
  /**
   * Initializes a new instance of the GetObservationByIdUseCase class.
   *
   * @param observationRepository The repository for observation persistence.
   */
  constructor(private readonly observationRepository: ObservationRepository) {}

  /**
   * Executes the use case to get an observation by its ID.
   *
   * @param input The data containing the observation ID.
   * @return A promise that resolves to the found observation.
   * @throws {NotFoundError} If the observation is not found.
   */
  async execute(
    input: GetObservationByIdInput
  ): Promise<GetObservationByIdOutput> {
    // 1. Find the observation by ID.
    const observation = await this.observationRepository.findById(input.id);
    if (!observation) {
      throw new NotFoundError('Observação');
    }

    return observation;
  }
}
