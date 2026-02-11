import { DeleteExamUseCase } from '@/core/application/use-cases/exam/delete-exam.use-case';
import { FindExamsUseCase } from '@/core/application/use-cases/exam/find-exams.use-case';
import { GetExamByIdUseCase } from '@/core/application/use-cases/exam/get-exam-by-id.use-case';
import { RegisterExamUseCase } from '@/core/application/use-cases/exam/register-exam.use-case';
import { RestoreExamUseCase } from '@/core/application/use-cases/exam/restore-exam.use-case';
import { UpdateExamUseCase } from '@/core/application/use-cases/exam/update-exam.use-case';
import { PrismaAuditLogRepository } from '../repositories/prisma/audit-log.prisma.repository';
import { PrismaExamRepository } from '../repositories/prisma/exam.prisma.repository';
import { PrismaPatientRepository } from '../repositories/prisma/patient.prisma.repository';
import { PrismaUserRepository } from '../repositories/prisma/user.prisma.repository';

const examRepository = new PrismaExamRepository();
const patientRepository = new PrismaPatientRepository();
const auditLogRepository = new PrismaAuditLogRepository();
const userRepository = new PrismaUserRepository();

/**
 * Factory function to create an instance of RegisterExamUseCase.
 * Injects repositories for exams, patients, and audit logging.
 * @returns A fully initialized RegisterExamUseCase.
 */
export function makeRegisterExamUseCase() {
  return new RegisterExamUseCase(
    examRepository,
    patientRepository,
    auditLogRepository
  );
}

/**
 * Factory function to create an instance of FindExamsUseCase.
 * Injects repositories for exams, users, and patients.
 * @returns A fully initialized FindExamsUseCase.
 */
export function makeFindExamsUseCase() {
  return new FindExamsUseCase(
    examRepository,
    userRepository,
    patientRepository
  );
}

/**
 * Factory function to create an instance of GetExamByIdUseCase.
 * @returns A fully initialized GetExamByIdUseCase.
 */
export function makeGetExamByIdUseCase() {
  return new GetExamByIdUseCase(examRepository);
}

/**
 * Factory function to create an instance of UpdateExamUseCase.
 * @returns A fully initialized UpdateExamUseCase.
 */
export function makeUpdateExamUseCase() {
  return new UpdateExamUseCase(examRepository, auditLogRepository);
}

/**
 * Factory function to create an instance of DeleteExamUseCase.
 * @returns A fully initialized DeleteExamUseCase.
 */
export function makeDeleteExamUseCase() {
  return new DeleteExamUseCase(examRepository, auditLogRepository);
}

/**
 * Factory function to create an instance of RestoreExamUseCase.
 * @returns A fully initialized RestoreExamUseCase.
 */
export function makeRestoreExamUseCase() {
  return new RestoreExamUseCase(examRepository, auditLogRepository);
}
