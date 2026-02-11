import { treatmentSchema } from '@/core/application/validation/schemas/treatment.schema';
import { formatZodError } from '@/core/application/validation/zod.utils';
import { SYSTEM_CONSTANTS } from '@/core/domain/constants/system.constants';
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
  /**
   * Creates an instance of RegisterTreatmentUseCase.
   * @param treatmentRepository The repository for treatment data operations.
   * @param patientRepository The repository for patient data operations.
   * @param auditLogRepository The repository for audit logging.
   */
  constructor(
    private readonly treatmentRepository: TreatmentRepository,
    private readonly patientRepository: PatientRepository,
    private readonly auditLogRepository: AuditLogRepository
  ) {}

  /**
   * Executes the use case to register a new treatment.
   * @param input The treatment data and audit info.
   * @return A promise that resolves to the registered treatment.
   * @throws {ValidationError} If the treatment data is invalid.
   * @throws {NotFoundError} If the patient is not found.
   */
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
      createdBy: userId ?? SYSTEM_CONSTANTS.DEFAULT_SYSTEM_USER_ID,
      updatedBy: null,
    });

    // 4. Create audit log.
    await this.auditLogRepository.create({
      userId: userId ?? SYSTEM_CONSTANTS.DEFAULT_SYSTEM_USER_ID,
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
