import { Patient } from '@/core/domain/entities/patient.entity';
import { PatientRepository } from '@/core/domain/repositories/patient.repository';
import { GetPatientDto } from '../../dtos/patient/get-patient.dto';
import { UseCase } from '../use-case.interface';

/**
 * Use case to retrieve a single patient by ID.
 */
export class GetPatientByIdUseCase implements UseCase<
  GetPatientDto,
  Patient | null
> {
  constructor(private readonly patientRepository: PatientRepository) {}

  async execute(input: GetPatientDto): Promise<Patient | null> {
    return await this.patientRepository.findById(
      input.id,
      input.includeDeleted
    );
  }
}
