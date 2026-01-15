import { NotFoundError } from '@/core/domain/errors/app.error';
import { NotificationRepository } from '@/core/domain/repositories/notification.repository';
import { PatientRepository } from '@/core/domain/repositories/patient.repository';
import {
  RegisterNotificationInput,
  RegisterNotificationOutput,
} from '../../contracts/notification/register-notification.contract';
import { UseCase } from '../use-case.interface';

/**
 * Use case to register a new notification for a patient.
 */
export class RegisterNotificationUseCase implements UseCase<
  RegisterNotificationInput,
  RegisterNotificationOutput
> {
  constructor(
    private readonly notificationRepository: NotificationRepository,
    private readonly patientRepository: PatientRepository
  ) {}

  async execute(
    input: RegisterNotificationInput
  ): Promise<RegisterNotificationOutput> {
    // 1. Verify that the patient exists.
    const patient = await this.patientRepository.findById(input.patientId);
    if (!patient) {
      throw new NotFoundError('Patient not found');
    }

    // 2. Delegate to the repository.
    return this.notificationRepository.create(input);
  }
}
