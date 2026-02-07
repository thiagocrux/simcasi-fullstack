import { DeleteObservationUseCase } from '@/core/application/use-cases/observation/delete-observation.use-case';
import { FindObservationsUseCase } from '@/core/application/use-cases/observation/find-observations.use-case';
import { GetObservationByIdUseCase } from '@/core/application/use-cases/observation/get-observation-by-id.use-case';
import { RegisterObservationUseCase } from '@/core/application/use-cases/observation/register-observation.use-case';
import { RestoreObservationUseCase } from '@/core/application/use-cases/observation/restore-observation.use-case';
import { UpdateObservationUseCase } from '@/core/application/use-cases/observation/update-observation.use-case';
import { PrismaAuditLogRepository } from '../repositories/prisma/audit-log.prisma.repository';
import { PrismaObservationRepository } from '../repositories/prisma/observation.prisma.repository';
import { PrismaPatientRepository } from '../repositories/prisma/patient.prisma.repository';
import { PrismaUserRepository } from '../repositories/prisma/user.prisma.repository';

const observationRepository = new PrismaObservationRepository();
const patientRepository = new PrismaPatientRepository();
const auditLogRepository = new PrismaAuditLogRepository();
const userRepository = new PrismaUserRepository();

export function makeRegisterObservationUseCase() {
  return new RegisterObservationUseCase(
    observationRepository,
    patientRepository,
    auditLogRepository
  );
}

export function makeFindObservationsUseCase() {
  return new FindObservationsUseCase(
    observationRepository,
    userRepository,
    patientRepository
  );
}

export function makeGetObservationByIdUseCase() {
  return new GetObservationByIdUseCase(observationRepository);
}

export function makeUpdateObservationUseCase() {
  return new UpdateObservationUseCase(
    observationRepository,
    auditLogRepository
  );
}

export function makeDeleteObservationUseCase() {
  return new DeleteObservationUseCase(
    observationRepository,
    auditLogRepository
  );
}

export function makeRestoreObservationUseCase() {
  return new RestoreObservationUseCase(
    observationRepository,
    auditLogRepository
  );
}
