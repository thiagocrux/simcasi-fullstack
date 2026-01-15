import { notificationSchema } from '@/core/application/validation/schemas/notification.schema';
import { NotFoundError, ValidationError } from '@/core/domain/errors/app.error';
import { AuditLogRepository } from '@/core/domain/repositories/audit-log.repository';
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
    private readonly patientRepository: PatientRepository,
    private readonly auditLogRepository: AuditLogRepository
  ) {}

  async execute(
    input: RegisterNotificationInput
  ): Promise<RegisterNotificationOutput> {
    const { createdBy, ipAddress, userAgent, ...data } = input;

    // 1. Validate input.
    const validation = notificationSchema.safeParse(data);
    if (!validation.success) {
      throw new ValidationError(
        'Invalid register notification data.',
        validation.error.flatten().fieldErrors
      );
    }

    // 2. Verify that the patient exists.
    const patient = await this.patientRepository.findById(data.patientId);
    if (!patient) {
      throw new NotFoundError('Patient not found');
    }

    // 3. Delegate to the repository.
    const notification = await this.notificationRepository.create({
      ...data,
      createdBy: createdBy || 'SYSTEM',
    });

    // 4. Create audit log.
    await this.auditLogRepository.create({
      userId: createdBy || 'SYSTEM',
      action: 'CREATE',
      entityName: 'NOTIFICATION',
      entityId: notification.id,
      newValues: notification,
      ipAddress,
      userAgent,
    });

    return notification;
  }
}
