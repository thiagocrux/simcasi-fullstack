import { SYSTEM_CONSTANTS } from '@/core/domain/constants/system.constants';
import { NotFoundError } from '@/core/domain/errors/app.error';
import { AuditLogRepository } from '@/core/domain/repositories/audit-log.repository';
import { ExamRepository } from '@/core/domain/repositories/exam.repository';
import { NotificationRepository } from '@/core/domain/repositories/notification.repository';
import { ObservationRepository } from '@/core/domain/repositories/observation.repository';
import { PatientRepository } from '@/core/domain/repositories/patient.repository';
import { TreatmentRepository } from '@/core/domain/repositories/treatment.repository';
import {
  RestorePatientInput,
  RestorePatientOutput,
} from '../../contracts/patient/restore-patient.contract';
import { UseCase } from '../use-case.interface';

/**
 * Use case to restore a logically deleted patient and their medical records.
 */
export class RestorePatientUseCase implements UseCase<
  RestorePatientInput,
  RestorePatientOutput
> {
  constructor(
    private readonly patientRepository: PatientRepository,
    private readonly examRepository: ExamRepository,
    private readonly notificationRepository: NotificationRepository,
    private readonly observationRepository: ObservationRepository,
    private readonly treatmentRepository: TreatmentRepository,
    private readonly auditLogRepository: AuditLogRepository
  ) {}

  async execute(input: RestorePatientInput): Promise<RestorePatientOutput> {
    const { id, userId, ipAddress, userAgent } = input;

    // 1. Check if patient exists (including deleted).
    const patient = await this.patientRepository.findById(id, true);
    if (!patient) {
      throw new NotFoundError('Patient not found');
    }

    // 2. Perform restore if it was deleted.
    if (patient.deletedAt) {
      const deletionDate = patient.deletedAt;

      await this.patientRepository.restore(
        id,
        userId ?? SYSTEM_CONSTANTS.DEFAULT_SYSTEM_USER_ID
      );

      // 3. Cascade restore to all related medical records deleted since the patient was deleted.
      await Promise.all([
        this.examRepository.restoreByPatientId(
          id,
          userId ?? SYSTEM_CONSTANTS.DEFAULT_SYSTEM_USER_ID,
          deletionDate
        ),
        this.notificationRepository.restoreByPatientId(
          id,
          userId ?? SYSTEM_CONSTANTS.DEFAULT_SYSTEM_USER_ID,
          deletionDate
        ),
        this.observationRepository.restoreByPatientId(
          id,
          userId ?? SYSTEM_CONSTANTS.DEFAULT_SYSTEM_USER_ID,
          deletionDate
        ),
        this.treatmentRepository.restoreByPatientId(
          id,
          userId ?? SYSTEM_CONSTANTS.DEFAULT_SYSTEM_USER_ID,
          deletionDate
        ),
      ]);
      patient.deletedAt = null;

      // 4. Audit the restoration.
      await this.auditLogRepository.create({
        userId: userId ?? SYSTEM_CONSTANTS.DEFAULT_SYSTEM_USER_ID,
        action: 'RESTORE',
        entityName: 'PATIENT',
        entityId: id,
        newValues: { restoredAt: new Date() },
        ipAddress,
        userAgent,
      });
    }

    return patient;
  }
}
