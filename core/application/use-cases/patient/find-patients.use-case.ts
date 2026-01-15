import { PatientRepository } from '@/core/domain/repositories/patient.repository';
import {
  FindPatientsInput,
  FindPatientsOutput,
} from '../../contracts/patient/find-patients.contract';
import { UseCase } from '../use-case.interface';

/**
 * Use case to retrieve a list of patients with pagination and search.
 */
export class FindPatientsUseCase implements UseCase<
  FindPatientsInput,
  FindPatientsOutput
> {
  constructor(private readonly patientRepository: PatientRepository) {}

  async execute(input: FindPatientsInput): Promise<FindPatientsOutput> {
    return await this.patientRepository.findAll(input);
  }
}
