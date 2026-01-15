import { DeleteExamUseCase } from '@/core/application/use-cases/exam/delete-exam.use-case';
import { FindExamsUseCase } from '@/core/application/use-cases/exam/find-exams.use-case';
import { GetExamByIdUseCase } from '@/core/application/use-cases/exam/get-exam-by-id.use-case';
import { RegisterExamUseCase } from '@/core/application/use-cases/exam/register-exam.use-case';
import { RestoreExamUseCase } from '@/core/application/use-cases/exam/restore-exam.use-case';
import { UpdateExamUseCase } from '@/core/application/use-cases/exam/update-exam.use-case';
import { PrismaAuditLogRepository } from '../repositories/prisma/audit-log.prisma.repository';
import { PrismaExamRepository } from '../repositories/prisma/exam.prisma.repository';
import { PrismaPatientRepository } from '../repositories/prisma/patient.prisma.repository';

const examRepository = new PrismaExamRepository();
const patientRepository = new PrismaPatientRepository();
const auditLogRepository = new PrismaAuditLogRepository();

export function makeRegisterExamUseCase() {
  return new RegisterExamUseCase(
    examRepository,
    patientRepository,
    auditLogRepository
  );
}

export function makeFindExamsUseCase() {
  return new FindExamsUseCase(examRepository);
}

export function makeGetExamByIdUseCase() {
  return new GetExamByIdUseCase(examRepository);
}

export function makeUpdateExamUseCase() {
  return new UpdateExamUseCase(examRepository, auditLogRepository);
}

export function makeDeleteExamUseCase() {
  return new DeleteExamUseCase(examRepository, auditLogRepository);
}

export function makeRestoreExamUseCase() {
  return new RestoreExamUseCase(examRepository, auditLogRepository);
}
