import { NotFoundError } from '@/core/domain/errors/app.error';
import { PatientRepository } from '@/core/domain/repositories/patient.repository';
import {
  GetPatientInput,
  GetPatientOutput,
} from '../../contracts/patient/get-patient-by-id.contract';
import { UseCase } from '../use-case.interface';

/**
 * Use case to retrieve a single patient by ID.
 */
export class GetPatientByIdUseCase implements UseCase<
  GetPatientInput,
  GetPatientOutput
> {
  constructor(private readonly patientRepository: PatientRepository) {}

  async execute(input: GetPatientInput): Promise<GetPatientOutput> {
    const patient = await this.patientRepository.findById(
      input.id,
      input.includeDeleted
    );
    if (!patient) {
      throw new NotFoundError('Patient');
    }

    return patient;
  }
}
