import { PatientRepository } from '@/core/domain/repositories/patient.repository';
import {
  FindPatientsDto,
  FindPatientsResponseDto,
} from '../../dtos/patient/find-patients.dto';
import { UseCase } from '../use-case.interface';

/**
 * Use case to retrieve a list of patients with pagination and search.
 */
export class FindPatientsUseCase implements UseCase<
  FindPatientsDto,
  FindPatientsResponseDto
> {
  constructor(private readonly patientRepository: PatientRepository) {}

  async execute(input: FindPatientsDto): Promise<FindPatientsResponseDto> {
    return await this.patientRepository.findAll(input);
  }
}
