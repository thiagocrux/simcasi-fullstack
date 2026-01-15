import { NotFoundError } from '@/core/domain/errors/app.error';
import { TreatmentRepository } from '@/core/domain/repositories/treatment.repository';
import {
  RestoreTreatmentInput,
  RestoreTreatmentOutput,
} from '../../contracts/treatment/restore-treatment.contract';
import { UseCase } from '../use-case.interface';

/**
 * Use case to restore a soft-deleted treatment.
 */
export class RestoreTreatmentUseCase implements UseCase<
  RestoreTreatmentInput,
  RestoreTreatmentOutput
> {
  constructor(private readonly treatmentRepository: TreatmentRepository) {}

  async execute(input: RestoreTreatmentInput): Promise<RestoreTreatmentOutput> {
    // 1. Check if the treatment exists (including deleted).
    const treatment = await this.treatmentRepository.findById(input.id, true);
    if (!treatment) {
      throw new NotFoundError('Treatment not found');
    }

    // 2. Perform the restoration if it was deleted.
    if (treatment.deletedAt) {
      await this.treatmentRepository.restore(input.id);
    }

    return (await this.treatmentRepository.findById(
      input.id
    )) as RestoreTreatmentOutput;
  }
}
