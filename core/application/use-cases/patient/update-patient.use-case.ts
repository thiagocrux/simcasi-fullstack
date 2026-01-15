import { patientSchema } from '@/core/application/validation/schemas/patient.schema';
import {
  ConflictError,
  NotFoundError,
  ValidationError,
} from '@/core/domain/errors/app.error';
import { AuditLogRepository } from '@/core/domain/repositories/audit-log.repository';
import { PatientRepository } from '@/core/domain/repositories/patient.repository';
import {
  UpdatePatientInput,
  UpdatePatientOutput,
} from '../../contracts/patient/update-patient.contract';
import { UseCase } from '../use-case.interface';

/**
 * Use case to update an existing patient's information.
 */
export class UpdatePatientUseCase implements UseCase<
  UpdatePatientInput,
  UpdatePatientOutput
> {
  constructor(
    private readonly patientRepository: PatientRepository,
    private readonly auditLogRepository: AuditLogRepository
  ) {}

  async execute(input: UpdatePatientInput): Promise<UpdatePatientOutput> {
    const { id, userId, ipAddress, userAgent, ...data } = input;

    // 1. Validate input.
    const validation = patientSchema.partial().safeParse(data);
    if (!validation.success) {
      throw new ValidationError(
        'Invalid update patient data.',
        validation.error.flatten().fieldErrors
      );
    }

    // 2. Check if patient exists.
    const existing = await this.patientRepository.findById(id);
    if (!existing) {
      throw new NotFoundError('Patient');
    }

    // 3. If CPF is being updated, check if the new CPF is already in use.
    if (validation.data.cpf && validation.data.cpf !== existing.cpf) {
      const duplicateCpf = await this.patientRepository.findByCpf(
        validation.data.cpf
      );
      if (duplicateCpf) {
        throw new ConflictError(
          `The CPF ${validation.data.cpf} is already registered to another patient.`
        );
      }
    }

    // 4. Delegate update to repository.
    const updated = await this.patientRepository.update(id, {
      ...validation.data,
      birthDate: validation.data.birthDate
        ? new Date(validation.data.birthDate)
        : undefined,
    });

    // 5. Audit the update.
    await this.auditLogRepository.create({
      userId: userId || 'SYSTEM',
      action: 'UPDATE',
      entityName: 'PATIENT',
      entityId: id,
      oldValues: existing,
      newValues: validation.data,
      ipAddress,
      userAgent,
    });

    return updated;
  }
}
