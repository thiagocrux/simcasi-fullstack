import { Patient } from '@/core/domain/entities/patient.entity';
import { PatientRepository } from '@/core/domain/repositories/patient.repository';
import { RegisterPatientDto } from '../../dtos/patient/register-patient.dto';
import { UseCase } from '../use-case.interface';

/**
 * Use case to register a new patient.
 *
 * Rules:
 * 1. Check if an active patient with the same CPF exists.
 * 2. Check if an active patient with the same SUS card exists.
 * 3. If a deleted patient exists with the same unique data, the repository will handle restoration.
 */
export class RegisterPatientUseCase implements UseCase<
  RegisterPatientDto,
  Patient
> {
  constructor(private readonly patientRepository: PatientRepository) {}

  async execute(dto: RegisterPatientDto): Promise<Patient> {
    // 1. Validate if an active patient already has this CPF
    const existingByCpf = await this.patientRepository.findByCpf(dto.cpf);

    if (existingByCpf) {
      throw new Error(
        `Patient with CPF ${dto.cpf} is already registered and active.`
      );
    }

    // 2. Validate if an active patient already has this SUS card number
    const existingBySus = await this.patientRepository.findBySusCardNumber(
      dto.susCardNumber
    );

    if (existingBySus) {
      throw new Error(
        `Patient with SUS Card Number ${dto.susCardNumber} is already registered and active.`
      );
    }

    // 3. Delegate creation to repository (which handles restoration logic)
    return await this.patientRepository.create(dto);
  }
}
