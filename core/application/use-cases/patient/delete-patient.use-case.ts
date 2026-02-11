import { SYSTEM_CONSTANTS } from '@/core/domain/constants/system.constants';
import { NotFoundError } from '@/core/domain/errors/app.error';
import { AuditLogRepository } from '@/core/domain/repositories/audit-log.repository';
import { ExamRepository } from '@/core/domain/repositories/exam.repository';
import { NotificationRepository } from '@/core/domain/repositories/notification.repository';
import { ObservationRepository } from '@/core/domain/repositories/observation.repository';
import { PatientRepository } from '@/core/domain/repositories/patient.repository';
import { TreatmentRepository } from '@/core/domain/repositories/treatment.repository';
import {
  DeletePatientInput,
  DeletePatientOutput,
} from '../../contracts/patient/delete-patient.contract';
import { UseCase } from '../use-case.interface';

/**
 * Use case to logically delete a patient and cascade the deletion to their medical records.
 */
export class DeletePatientUseCase implements UseCase<
  DeletePatientInput,
  DeletePatientOutput
> {
  /**
   * Initializes a new instance of the DeletePatientUseCase class.
   *
   * @param patientRepository The repository for patient persistence.
   * @param examRepository The repository for exam persistence.
   * @param notificationRepository The repository for notification persistence.
   * @param observationRepository The repository for observation persistence.
   * @param treatmentRepository The repository for treatment persistence.
   * @param auditLogRepository The repository for audit logging.
   */
  constructor(
    private readonly patientRepository: PatientRepository,
    private readonly examRepository: ExamRepository,
    private readonly notificationRepository: NotificationRepository,
    private readonly observationRepository: ObservationRepository,
    private readonly treatmentRepository: TreatmentRepository,
    private readonly auditLogRepository: AuditLogRepository
  ) {}

  /**
   * Executes the use case to soft delete a patient and related records.
   *
   * @param input The data containing the patient ID and auditor info.
   * @return A promise that resolves when the deletion is complete.
   * @throws {NotFoundError} If the patient is not found.
   */
  async execute(input: DeletePatientInput): Promise<DeletePatientOutput> {
    const { id, userId, ipAddress, userAgent } = input;

    // 1. Check if patient exists.
    const patient = await this.patientRepository.findById(id);

    if (!patient) {
      throw new NotFoundError('Patient not found');
    }

    const updaterId = userId ?? SYSTEM_CONSTANTS.DEFAULT_SYSTEM_USER_ID;

    // 2. Soft delete the patient.
    await this.patientRepository.softDelete(id, updaterId);

    // 3. Cascade soft delete to all related medical records.
    await Promise.all([
      this.examRepository.softDeleteByPatientId(id, updaterId),
      this.notificationRepository.softDeleteByPatientId(id, updaterId),
      this.observationRepository.softDeleteByPatientId(id, updaterId),
      this.treatmentRepository.softDeleteByPatientId(id, updaterId),
    ]);

    // 4. Audit the deletion.
    await this.auditLogRepository.create({
      userId: userId ?? SYSTEM_CONSTANTS.DEFAULT_SYSTEM_USER_ID,
      action: 'DELETE',
      entityName: 'PATIENT',
      entityId: id,
      oldValues: patient,
      ipAddress,
      userAgent,
    });
  }
}
