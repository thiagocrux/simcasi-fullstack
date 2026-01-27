import { observationSchema } from '@/core/application/validation/schemas/observation.schema';
import { formatZodError } from '@/core/application/validation/zod.utils';
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
  constructor(
    private readonly observationRepository: ObservationRepository,
    private readonly patientRepository: PatientRepository,
    private readonly auditLogRepository: AuditLogRepository
  ) {}

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
      ...observationData,
      createdBy: userId || 'SYSTEM',
      updatedBy: null,
    });

    // 4. Create audit log.
    await this.auditLogRepository.create({
      userId: userId || 'SYSTEM',
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
