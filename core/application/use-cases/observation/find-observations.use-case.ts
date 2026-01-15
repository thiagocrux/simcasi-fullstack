import { ObservationRepository } from '@/core/domain/repositories/observation.repository';
import {
  FindObservationsInput,
  FindObservationsOutput,
} from '../../contracts/observation/find-observations.contract';
import { UseCase } from '../use-case.interface';

/**
 * Use case to find observations with pagination and filters.
 */
export class FindObservationsUseCase implements UseCase<
  FindObservationsInput,
  FindObservationsOutput
> {
  constructor(private readonly observationRepository: ObservationRepository) {}

  async execute(input: FindObservationsInput): Promise<FindObservationsOutput> {
    // 1. Find all observations based on input criteria.
    return this.observationRepository.findAll(input);
  }
}
