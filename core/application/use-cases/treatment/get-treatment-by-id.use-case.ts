import { NotFoundError } from '@/core/domain/errors/app.error';
import { TreatmentRepository } from '@/core/domain/repositories/treatment.repository';
import {
  GetTreatmentByIdInput,
  GetTreatmentByIdOutput,
} from '../../contracts/treatment/get-treatment-by-id.contract';
import { UseCase } from '../use-case.interface';

/**
 * Use case to retrieve a treatment by ID.
 */
export class GetTreatmentByIdUseCase implements UseCase<
  GetTreatmentByIdInput,
  GetTreatmentByIdOutput
> {
  /**
   * Creates an instance of GetTreatmentByIdUseCase.
   * @param treatmentRepository The repository for treatment data operations.
   */
  constructor(private readonly treatmentRepository: TreatmentRepository) {}

  /**
   * Executes the use case to retrieve a treatment by ID.
   * @param input The treatment ID.
   * @return A promise that resolves to the treatment details.
   * @throws {NotFoundError} If the treatment is not found.
   */
  async execute(input: GetTreatmentByIdInput): Promise<GetTreatmentByIdOutput> {
    // 1. Find the treatment by ID.
    const treatment = await this.treatmentRepository.findById(input.id);
    if (!treatment) {
      throw new NotFoundError('Treatment not found');
    }

    return treatment;
  }
}
