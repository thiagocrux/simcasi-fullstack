import { NotFoundError } from '@/core/domain/errors/app.error';
import { PatientRepository } from '@/core/domain/repositories/patient.repository';
import { TreatmentRepository } from '@/core/domain/repositories/treatment.repository';
import {
  RegisterTreatmentInput,
  RegisterTreatmentOutput,
} from '../../contracts/treatment/register-treatment.contract';
import { UseCase } from '../use-case.interface';

/**
 * Use case to register a new treatment for a patient.
 */
export class RegisterTreatmentUseCase implements UseCase<
  RegisterTreatmentInput,
  RegisterTreatmentOutput
> {
  constructor(
    private readonly treatmentRepository: TreatmentRepository,
    private readonly patientRepository: PatientRepository
  ) {}

  async execute(
    input: RegisterTreatmentInput
  ): Promise<RegisterTreatmentOutput> {
    // 1. Verify that the patient exists.
    const patient = await this.patientRepository.findById(input.patientId);
    if (!patient) {
      throw new NotFoundError('Patient not found');
    }

    // 2. Delegate to the repository.
    return this.treatmentRepository.create(input);
  }
}
