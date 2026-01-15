import { patientSchema } from '@/core/application/validation/schemas/patient.schema';
import { ConflictError, ValidationError } from '@/core/domain/errors/app.error';
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
    const { userId, ipAddress, userAgent, ...patientData } = input;

    // 1. Validate input.
    const validation = patientSchema.safeParse(patientData);
    if (!validation.success) {
      throw new ValidationError(
        'Invalid register patient data.',
        validation.error.flatten().fieldErrors
      );
    }

    // 2. Validate if an active patient already has this CPF.
    const existingByCpf = await this.patientRepository.findByCpf(
      patientData.cpf
    );
    if (existingByCpf) {
      throw new ConflictError(
        `Patient with CPF ${patientData.cpf} is already registered and active.`
      );
    }

    // 3. Validate if an active patient already has this SUS card number.
    const existingBySus = await this.patientRepository.findBySusCardNumber(
      patientData.susCardNumber
    );
    if (existingBySus) {
      throw new ConflictError(
        `Patient with SUS Card Number ${patientData.susCardNumber} is already registered and active.`
      );
    }

    // 4. Delegate creation to repository (which handles restoration logic).
    const patient = await this.patientRepository.create({
      ...validation.data,
      birthDate: new Date(validation.data.birthDate),
      createdBy: userId || 'SYSTEM',
    });

    // 5. Audit the creation.
    await this.auditLogRepository.create({
      userId: userId || 'SYSTEM',
      action: 'CREATE',
      entityName: 'PATIENT',
      entityId: patient.id,
      newValues: patientData,
      ipAddress,
      userAgent,
    });

    return patient;
  }
}
