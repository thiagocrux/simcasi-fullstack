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
  /**
   * Initializes a new instance of the GetPatientByIdUseCase class.
   *
   * @param patientRepository The repository for patient persistence.
   */
  constructor(private readonly patientRepository: PatientRepository) {}

  /**
   * Executes the use case to get a patient by its ID.
   *
   * @param input The data containing the patient ID.
   * @return A promise that resolves to the found patient.
   * @throws {NotFoundError} If the patient is not found.
   */
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
