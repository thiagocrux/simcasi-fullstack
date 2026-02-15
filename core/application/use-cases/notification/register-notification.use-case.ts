import { notificationSchema } from '@/core/application/validation/schemas/notification.schema';
import { formatZodError } from '@/core/application/validation/zod.utils';
import { SYSTEM_CONSTANTS } from '@/core/domain/constants/system.constants';
import { NotFoundError, ValidationError } from '@/core/domain/errors/app.error';
import { AuditLogRepository } from '@/core/domain/repositories/audit-log.repository';
import { NotificationRepository } from '@/core/domain/repositories/notification.repository';
import { PatientRepository } from '@/core/domain/repositories/patient.repository';
import { getRequestContext } from '@/core/infrastructure/lib/request-context';
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
  /**
   * Initializes a new instance of the RegisterNotificationUseCase class.
   *
   * @param notificationRepository The repository for notification persistence.
   * @param patientRepository The repository for patient data.
   * @param auditLogRepository The repository for audit logging.
   */
  constructor(
    private readonly notificationRepository: NotificationRepository,
    private readonly patientRepository: PatientRepository,
    private readonly auditLogRepository: AuditLogRepository
  ) {}

  /**
   * Executes the use case to register a new notification.
   *
   * @param input The data for the new notification.
   * @return A promise that resolves to the registered notification.
   * @throws {ValidationError} If the input data is invalid.
   * @throws {NotFoundError} If the patient is not found.
   */
  async execute(
    input: RegisterNotificationInput
  ): Promise<RegisterNotificationOutput> {
    const { userId, ipAddress, userAgent } = getRequestContext();

    // 1. Validate input.
    const validation = notificationSchema.safeParse(input);
    if (!validation.success) {
      throw new ValidationError(
        'Dados de criação de notificação inválidos.',
        formatZodError(validation.error)
      );
    }

    // 2. Verify that the patient exists.
    const patient = await this.patientRepository.findById(input.patientId);
    if (!patient) {
      throw new NotFoundError('Paciente');
    }

    // 3. Delegate to the repository.
    const notification = await this.notificationRepository.create({
      ...input,
      createdBy: userId ?? SYSTEM_CONSTANTS.DEFAULT_SYSTEM_USER_ID,
      updatedBy: null,
    });

    // 4. Create audit log.
    await this.auditLogRepository.create({
      userId: userId ?? SYSTEM_CONSTANTS.DEFAULT_SYSTEM_USER_ID,
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
