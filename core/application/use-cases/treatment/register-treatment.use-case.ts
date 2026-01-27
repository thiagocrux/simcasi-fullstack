import { treatmentSchema } from '@/core/application/validation/schemas/treatment.schema';
import { formatZodError } from '@/core/application/validation/zod.utils';
import { NotFoundError, ValidationError } from '@/core/domain/errors/app.error';
import { AuditLogRepository } from '@/core/domain/repositories/audit-log.repository';
import { PatientRepository } from '@/core/domain/repositories/patient.repository';
import { TreatmentRepository } from '@/core/domain/repositories/treatment.repository';
import {
  RegisterTreatmentInput,
  RegisterTreatmentOutput,
} from '../../contracts/treatment/register-treatment.contract';
import { UseCase } from '../use-case.interface';

/**
 * Use case to register a new treatment for a patient.
 */
export class RegisterTreatmentUseCase implements UseCase<
  RegisterTreatmentInput,
  RegisterTreatmentOutput
> {
  constructor(
    private readonly treatmentRepository: TreatmentRepository,
    private readonly patientRepository: PatientRepository,
    private readonly auditLogRepository: AuditLogRepository
  ) {}

  async execute(
    input: RegisterTreatmentInput
  ): Promise<RegisterTreatmentOutput> {
    const { userId, ipAddress, userAgent, ...treatmentData } = input;

    // 1. Validate input.
    const validation = treatmentSchema.safeParse(treatmentData);
    if (!validation.success) {
      throw new ValidationError(
        'Invalid register treatment data.',
        formatZodError(validation.error)
      );
    }

    // 2. Verify that the patient exists.
    const patient = await this.patientRepository.findById(
      treatmentData.patientId
    );
    if (!patient) {
      throw new NotFoundError('Patient not found');
    }

    // 3. Delegate to the repository.
    const treatment = await this.treatmentRepository.create({
      ...validation.data,
      startDate: new Date(validation.data.startDate),
      createdBy: userId || 'SYSTEM',
      updatedBy: null,
    });

    // 4. Create audit log.
    await this.auditLogRepository.create({
      userId: userId || 'SYSTEM',
      action: 'CREATE',
      entityName: 'TREATMENT',
      entityId: treatment.id,
      newValues: treatment,
      ipAddress,
      userAgent,
    });

    return treatment;
  }
}
