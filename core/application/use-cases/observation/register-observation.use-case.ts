import { observationSchema } from '@/core/application/validation/schemas/observation.schema';
import { formatZodError } from '@/core/application/validation/zod.utils';
import { SYSTEM_CONSTANTS } from '@/core/domain/constants/system.constants';
import { NotFoundError, ValidationError } from '@/core/domain/errors/app.error';
import { AuditLogRepository } from '@/core/domain/repositories/audit-log.repository';
import { ObservationRepository } from '@/core/domain/repositories/observation.repository';
import { PatientRepository } from '@/core/domain/repositories/patient.repository';
import {
  RegisterObservationInput,
  RegisterObservationOutput,
} from '../../contracts/observation/register-observation.contract';
import { UseCase } from '../use-case.interface';

/**
 * Use case to register a new observation for a patient.
 */
export class RegisterObservationUseCase implements UseCase<
  RegisterObservationInput,
  RegisterObservationOutput
> {
  /**
   * Initializes a new instance of the RegisterObservationUseCase class.
   *
   * @param observationRepository The repository for observation persistence.
   * @param patientRepository The repository for patient data.
   * @param auditLogRepository The repository for audit logging.
   */
  constructor(
    private readonly observationRepository: ObservationRepository,
    private readonly patientRepository: PatientRepository,
    private readonly auditLogRepository: AuditLogRepository
  ) {}

  /**
   * Executes the use case to register a new observation.
   *
   * @param input The data for the new observation.
   * @return A promise that resolves to the registered observation.
   * @throws {ValidationError} If the input data is invalid.
   * @throws {NotFoundError} If the patient is not found.
   */
  async execute(
    input: RegisterObservationInput
  ): Promise<RegisterObservationOutput> {
    const { userId, ipAddress, userAgent, ...observationData } = input;

    // 1. Validate input.
    const validation = observationSchema.safeParse(observationData);
    if (!validation.success) {
      throw new ValidationError(
        'Invalid register observation data.',
        formatZodError(validation.error)
      );
    }

    // 2. Verify that the patient exists.
    const patient = await this.patientRepository.findById(
      observationData.patientId
    );
    if (!patient) {
      throw new NotFoundError('Patient not found');
    }

    // 3. Delegate to the repository.
    const observation = await this.observationRepository.create({
      ...validation.data,
      createdBy: userId ?? SYSTEM_CONSTANTS.DEFAULT_SYSTEM_USER_ID,
      updatedBy: null,
    });

    // 4. Create audit log.
    await this.auditLogRepository.create({
      userId: userId ?? SYSTEM_CONSTANTS.DEFAULT_SYSTEM_USER_ID,
      action: 'CREATE',
      entityName: 'OBSERVATION',
      entityId: observation.id,
      newValues: observation,
      ipAddress,
      userAgent,
    });

    return observation;
  }
}
