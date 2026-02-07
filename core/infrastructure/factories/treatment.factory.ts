import { DeleteTreatmentUseCase } from '@/core/application/use-cases/treatment/delete-treatment.use-case';
import { FindTreatmentsUseCase } from '@/core/application/use-cases/treatment/find-treatments.use-case';
import { GetTreatmentByIdUseCase } from '@/core/application/use-cases/treatment/get-treatment-by-id.use-case';
import { RegisterTreatmentUseCase } from '@/core/application/use-cases/treatment/register-treatment.use-case';
import { RestoreTreatmentUseCase } from '@/core/application/use-cases/treatment/restore-treatment.use-case';
import { UpdateTreatmentUseCase } from '@/core/application/use-cases/treatment/update-treatment.use-case';
import { PrismaAuditLogRepository } from '../repositories/prisma/audit-log.prisma.repository';
import { PrismaPatientRepository } from '../repositories/prisma/patient.prisma.repository';
import { PrismaTreatmentRepository } from '../repositories/prisma/treatment.prisma.repository';
import { PrismaUserRepository } from '../repositories/prisma/user.prisma.repository';

const repository = new PrismaTreatmentRepository();
const patientRepository = new PrismaPatientRepository();
const auditLogRepository = new PrismaAuditLogRepository();
const userRepository = new PrismaUserRepository();

export function makeRegisterTreatmentUseCase() {
  return new RegisterTreatmentUseCase(
    repository,
    patientRepository,
    auditLogRepository
  );
}

export function makeFindTreatmentsUseCase() {
  return new FindTreatmentsUseCase(
    repository,
    userRepository,
    patientRepository
  );
}

export function makeGetTreatmentByIdUseCase() {
  return new GetTreatmentByIdUseCase(repository);
}

export function makeUpdateTreatmentUseCase() {
  return new UpdateTreatmentUseCase(repository, auditLogRepository);
}

export function makeDeleteTreatmentUseCase() {
  return new DeleteTreatmentUseCase(repository, auditLogRepository);
}

export function makeRestoreTreatmentUseCase() {
  return new RestoreTreatmentUseCase(repository, auditLogRepository);
}
