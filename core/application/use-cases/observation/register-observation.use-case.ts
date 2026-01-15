import { NotFoundError } from '@/core/domain/errors/app.error';
import { ObservationRepository } from '@/core/domain/repositories/observation.repository';
import { PatientRepository } from '@/core/domain/repositories/patient.repository';
import {
  RegisterObservationInput,
  RegisterObservationOutput,
} from '../../contracts/observation/register-observation.contract';
import { UseCase } from '../use-case.interface';

/**
 * Use case to register a new observation for a patient.
 */
export class RegisterObservationUseCase implements UseCase<
  RegisterObservationInput,
  RegisterObservationOutput
> {
  constructor(
    private readonly observationRepository: ObservationRepository,
    private readonly patientRepository: PatientRepository
  ) {}

  async execute(
    input: RegisterObservationInput
  ): Promise<RegisterObservationOutput> {
    // 1. Verify that the patient exists.
    const patient = await this.patientRepository.findById(input.patientId);
    if (!patient) {
      throw new NotFoundError('Patient not found');
    }

    // 2. Delegate to the repository.
    return this.observationRepository.create(input);
  }
}
