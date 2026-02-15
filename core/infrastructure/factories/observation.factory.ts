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

/**
 * Factory function to create an instance of RegisterObservationUseCase.
 * Injects repositories for observations, patients, and audit logging.
 * @return A fully initialized RegisterObservationUseCase.
 */
export function makeRegisterObservationUseCase() {
  return new RegisterObservationUseCase(
    observationRepository,
    patientRepository,
    auditLogRepository
  );
}

/**
 * Factory function to create an instance of FindObservationsUseCase.
 * Injects repositories for observations, users, and patients.
 * @return A fully initialized FindObservationsUseCase.
 */
export function makeFindObservationsUseCase() {
  return new FindObservationsUseCase(
    observationRepository,
    userRepository,
    patientRepository
  );
}

/**
 * Factory function to create an instance of GetObservationByIdUseCase.
 * @return A fully initialized GetObservationByIdUseCase.
 */
export function makeGetObservationByIdUseCase() {
  return new GetObservationByIdUseCase(observationRepository);
}

/**
 * Factory function to create an instance of UpdateObservationUseCase.
 * @return A fully initialized UpdateObservationUseCase.
 */
export function makeUpdateObservationUseCase() {
  return new UpdateObservationUseCase(
    observationRepository,
    auditLogRepository
  );
}

/**
 * Factory function to create an instance of DeleteObservationUseCase.
 * @return A fully initialized DeleteObservationUseCase.
 */
export function makeDeleteObservationUseCase() {
  return new DeleteObservationUseCase(
    observationRepository,
    auditLogRepository
  );
}

/**
 * Factory function to create an instance of RestoreObservationUseCase.
 * @return A fully initialized RestoreObservationUseCase.
 */
export function makeRestoreObservationUseCase() {
  return new RestoreObservationUseCase(
    observationRepository,
    auditLogRepository
  );
}
