import { Patient } from '@/core/domain/entities/patient.entity';
import { PatientRepository } from '@/core/domain/repositories/patient.repository';
import { UpdatePatientDto } from '../../dtos/patient/update-patient.dto';
import { UseCase } from '../use-case.interface';

/**
 * Use case to update an existing patient's information.
 */
export class UpdatePatientUseCase implements UseCase<
  UpdatePatientDto,
  Patient
> {
  constructor(private readonly patientRepository: PatientRepository) {}

  async execute(input: UpdatePatientDto): Promise<Patient> {
    const { id, data } = input;

    // 1. Check if patient exists
    const existing = await this.patientRepository.findById(id);

    if (!existing) {
      throw new Error(`Patient with ID ${id} not found.`);
    }

    // 2. If CPF is being updated, check if the new CPF is already in use
    if (data.cpf && data.cpf !== existing.cpf) {
      const duplicateCpf = await this.patientRepository.findByCpf(data.cpf);

      if (duplicateCpf) {
        throw new Error(
          `The CPF ${data.cpf} is already registered to another patient.`
        );
      }
    }

    // 3. Delegate update to repository
    return await this.patientRepository.update(id, data);
  }
}
