import { NotFoundError } from '@/core/domain/errors/app.error';
import { TreatmentRepository } from '@/core/domain/repositories/treatment.repository';
import {
  UpdateTreatmentInput,
  UpdateTreatmentOutput,
} from '../../contracts/treatment/update-treatment.contract';
import { UseCase } from '../use-case.interface';

/**
 * Use case to update an existing treatment.
 */
export class UpdateTreatmentUseCase implements UseCase<
  UpdateTreatmentInput,
  UpdateTreatmentOutput
> {
  constructor(private readonly treatmentRepository: TreatmentRepository) {}

  async execute(input: UpdateTreatmentInput): Promise<UpdateTreatmentOutput> {
    const { id, ...data } = input;

    // 1. Check if the treatment exists.
    const treatment = await this.treatmentRepository.findById(id);
    if (!treatment) {
      throw new NotFoundError('Treatment not found');
    }

    // 2. Update the treatment.
    return this.treatmentRepository.update(id, data);
  }
}
