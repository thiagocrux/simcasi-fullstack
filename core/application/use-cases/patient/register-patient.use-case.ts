import { ConflictError } from '@/core/domain/errors/app.error';
import { PatientRepository } from '@/core/domain/repositories/patient.repository';
import {
  RegisterPatientInput,
  RegisterPatientOutput,
} from '../../contracts/patient/register-patient.contract';
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
  RegisterPatientInput,
  RegisterPatientOutput
> {
  constructor(private readonly patientRepository: PatientRepository) {}

  async execute(input: RegisterPatientInput): Promise<RegisterPatientOutput> {
    // 1. Validate if an active patient already has this CPF.
    const existingByCpf = await this.patientRepository.findByCpf(input.cpf);
    if (existingByCpf) {
      throw new ConflictError(
        `Patient with CPF ${input.cpf} is already registered and active.`
      );
    }

    // 2. Validate if an active patient already has this SUS card number.
    const existingBySus = await this.patientRepository.findBySusCardNumber(
      input.susCardNumber
    );
    if (existingBySus) {
      throw new ConflictError(
        `Patient with SUS Card Number ${input.susCardNumber} is already registered and active.`
      );
    }

    // 3. Delegate creation to repository (which handles restoration logic).
    return await this.patientRepository.create(input);
  }
}
