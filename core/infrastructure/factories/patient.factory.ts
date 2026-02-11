import { DeletePatientUseCase } from '@/core/application/use-cases/patient/delete-patient.use-case';
import { FindPatientsUseCase } from '@/core/application/use-cases/patient/find-patients.use-case';
import { GetPatientByIdUseCase } from '@/core/application/use-cases/patient/get-patient-by-id.use-case';
import { RegisterPatientUseCase } from '@/core/application/use-cases/patient/register-patient.use-case';
import { RestorePatientUseCase } from '@/core/application/use-cases/patient/restore-patient.use-case';
import { UpdatePatientUseCase } from '@/core/application/use-cases/patient/update-patient.use-case';
import { PrismaAuditLogRepository } from '../repositories/prisma/audit-log.prisma.repository';
import { PrismaExamRepository } from '../repositories/prisma/exam.prisma.repository';
import { PrismaNotificationRepository } from '../repositories/prisma/notification.prisma.repository';
import { PrismaObservationRepository } from '../repositories/prisma/observation.prisma.repository';
import { PrismaPatientRepository } from '../repositories/prisma/patient.prisma.repository';
import { PrismaTreatmentRepository } from '../repositories/prisma/treatment.prisma.repository';
import { PrismaUserRepository } from '../repositories/prisma/user.prisma.repository';

const patientRepository = new PrismaPatientRepository();
const auditLogRepository = new PrismaAuditLogRepository();
const examRepository = new PrismaExamRepository();
const notificationRepository = new PrismaNotificationRepository();
const treatmentRepository = new PrismaTreatmentRepository();
const observationRepository = new PrismaObservationRepository();
const userRepository = new PrismaUserRepository();

/**
 * Factory function to create an instance of RegisterPatientUseCase.
 * @returns A fully initialized RegisterPatientUseCase.
 */
export function makeRegisterPatientUseCase() {
  return new RegisterPatientUseCase(patientRepository, auditLogRepository);
}

/**
 * Factory function to create an instance of FindPatientsUseCase.
 * @returns A fully initialized FindPatientsUseCase.
 */
export function makeFindPatientsUseCase() {
  return new FindPatientsUseCase(patientRepository, userRepository);
}

/**
 * Factory function to create an instance of GetPatientByIdUseCase.
 * @returns A fully initialized GetPatientByIdUseCase.
 */
export function makeGetPatientByIdUseCase() {
  return new GetPatientByIdUseCase(patientRepository);
}

/**
 * Factory function to create an instance of UpdatePatientUseCase.
 * @returns A fully initialized UpdatePatientUseCase.
 */
export function makeUpdatePatientUseCase() {
  return new UpdatePatientUseCase(patientRepository, auditLogRepository);
}

/**
 * Factory function to create an instance of DeletePatientUseCase.
 * Injects repositories for patients, exams, notifications, observations, treatments, and audit logging.
 * @returns A fully initialized DeletePatientUseCase.
 */
export function makeDeletePatientUseCase() {
  return new DeletePatientUseCase(
    patientRepository,
    examRepository,
    notificationRepository,
    observationRepository,
    treatmentRepository,
    auditLogRepository
  );
}

/**
 * Factory function to create an instance of RestorePatientUseCase.
 * Injects repositories for patients, exams, notifications, observations, treatments, and audit logging.
 * @returns A fully initialized RestorePatientUseCase.
 */
export function makeRestorePatientUseCase() {
  return new RestorePatientUseCase(
    patientRepository,
    examRepository,
    notificationRepository,
    observationRepository,
    treatmentRepository,
    auditLogRepository
  );
}
