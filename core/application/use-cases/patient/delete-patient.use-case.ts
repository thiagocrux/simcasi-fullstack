import { ExamRepository } from '@/core/domain/repositories/exam.repository';
import { NotificationRepository } from '@/core/domain/repositories/notification.repository';
import { ObservationRepository } from '@/core/domain/repositories/observation.repository';
import { PatientRepository } from '@/core/domain/repositories/patient.repository';
import { TreatmentRepository } from '@/core/domain/repositories/treatment.repository';
import { UseCase } from '../use-case.interface';

/**
 * Use case to logically delete a patient and cascade the deletion to their medical records.
 */
export class DeletePatientUseCase implements UseCase<string, void> {
  constructor(
    private readonly patientRepository: PatientRepository,
    private readonly examRepository: ExamRepository,
    private readonly notificationRepository: NotificationRepository,
    private readonly observationRepository: ObservationRepository,
    private readonly treatmentRepository: TreatmentRepository
  ) {}

  async execute(patientId: string): Promise<void> {
    // 1. Soft delete the patient
    await this.patientRepository.softDelete(patientId);

    // 2. Cascade soft delete to all related medical records
    await Promise.all([
      this.examRepository.softDeleteByPatientId(patientId),
      this.notificationRepository.softDeleteByPatientId(patientId),
      this.observationRepository.softDeleteByPatientId(patientId),
      this.treatmentRepository.softDeleteByPatientId(patientId),
    ]);
  }
}
