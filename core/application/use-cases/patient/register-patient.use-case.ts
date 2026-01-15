import { ConflictError } from '@/core/domain/errors/app.error';
import { AuditLogRepository } from '@/core/domain/repositories/audit-log.repository';
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
 * 4. Registers an audit log for the creation.
 */
export class RegisterPatientUseCase implements UseCase<
  RegisterPatientInput,
  RegisterPatientOutput
> {
  constructor(
    private readonly patientRepository: PatientRepository,
    private readonly auditLogRepository: AuditLogRepository
  ) {}

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
    const patient = await this.patientRepository.create({
      ...input,
      createdBy: input.createdBy || 'SYSTEM',
    });

    // 4. Audit the creation.
    await this.auditLogRepository.create({
      userId: input.createdBy || 'SYSTEM',
      action: 'CREATE',
      entityName: 'PATIENT',
      entityId: patient.id,
      newValues: input,
      ipAddress: input.ipAddress,
      userAgent: input.userAgent,
    });

    return patient;
  }
}
