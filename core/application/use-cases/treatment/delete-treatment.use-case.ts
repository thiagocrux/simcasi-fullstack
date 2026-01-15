import { NotFoundError } from '@/core/domain/errors/app.error';
import { TreatmentRepository } from '@/core/domain/repositories/treatment.repository';
import {
  DeleteTreatmentInput,
  DeleteTreatmentOutput,
} from '../../contracts/treatment/delete-treatment.contract';
import { UseCase } from '../use-case.interface';

/**
 * Use case to soft delete a treatment.
 */
export class DeleteTreatmentUseCase implements UseCase<
  DeleteTreatmentInput,
  DeleteTreatmentOutput
> {
  constructor(private readonly treatmentRepository: TreatmentRepository) {}

  async execute(input: DeleteTreatmentInput): Promise<DeleteTreatmentOutput> {
    // 1. Check if the treatment exists.
    const treatment = await this.treatmentRepository.findById(input.id);
    if (!treatment) {
      throw new NotFoundError('Treatment not found');
    }

    // 2. Soft delete the treatment.
    await this.treatmentRepository.softDelete(input.id);
  }
}
