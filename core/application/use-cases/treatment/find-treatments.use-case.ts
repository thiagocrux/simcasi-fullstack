import { TreatmentRepository } from '@/core/domain/repositories/treatment.repository';
import {
  FindTreatmentsInput,
  FindTreatmentsOutput,
} from '../../contracts/treatment/find-treatments.contract';
import { UseCase } from '../use-case.interface';

/**
 * Use case to find treatments with pagination and filters.
 */
export class FindTreatmentsUseCase implements UseCase<
  FindTreatmentsInput,
  FindTreatmentsOutput
> {
  constructor(private readonly treatmentRepository: TreatmentRepository) {}

  async execute(input: FindTreatmentsInput): Promise<FindTreatmentsOutput> {
    // 1. Find all treatments based on input criteria.
    return this.treatmentRepository.findAll(input);
  }
}
