import { patientSchema } from '@/core/application/validation/schemas/patient.schema';
import { formatZodError } from '@/core/application/validation/zod.utils';
import { SYSTEM_CONSTANTS } from '@/core/domain/constants/system.constants';
import { ConflictError, ValidationError } from '@/core/domain/errors/app.error';
import { AuditLogRepository } from '@/core/domain/repositories/audit-log.repository';
import { PatientRepository } from '@/core/domain/repositories/patient.repository';
import { getRequestContext } from '@/core/infrastructure/lib/request-context';
import {
  RegisterPatientInput,
  RegisterPatientOutput,
} from '../../contracts/patient/register-patient.contract';
import { UseCase } from '../use-case.interface';

/**
 * Use case to register a new patient.
 *
 * Rules:
 * 1. Check if an active patient with the same CPF or SUS card exists (Conflict).
 * 2. If a soft-deleted record exists with the same CPF or SUS card, restore it and update with new data.
 * 3. Otherwise, create a new patient record.
 * 4. Log the appropriate audit action (CREATE or RESTORE).
 */
export class RegisterPatientUseCase implements UseCase<
  RegisterPatientInput,
  RegisterPatientOutput
> {
  /**
   * Initializes a new instance of the RegisterPatientUseCase class.
   *
   * @param patientRepository The repository for patient persistence.
   * @param auditLogRepository The repository for audit logging.
   */
  constructor(
    private readonly patientRepository: PatientRepository,
    private readonly auditLogRepository: AuditLogRepository
  ) {}

  /**
   * Executes the use case to register a new patient.
   *
   * @param input The data for the new patient.
   * @return A promise that resolves to the registered or restored patient.
   * @throws {ValidationError} If the input data is invalid.
   * @throws {ConflictError} If a patient with the same CPF or SUS card already exists.
   */
  async execute(input: RegisterPatientInput): Promise<RegisterPatientOutput> {
    const { userId, ipAddress, userAgent } = getRequestContext();

    // 1. Validate input data using Zod schema.
    const validation = patientSchema.safeParse(input);
    if (!validation.success) {
      throw new ValidationError(
        'Invalid register patient data.',
        formatZodError(validation.error)
      );
    }

    // 2. Search for existing patient by CPF (including soft-deleted).
    const existingByCpf = await this.patientRepository.findByCpf(
      input.cpf,
      true
    );

    if (existingByCpf && !existingByCpf.deletedAt) {
      throw new ConflictError(
        `Já existe um paciente de CPF ${input.cpf} cadastrado e ativo.`
      );
    }

    // 3. Search for existing patient by SUS Card Number (including soft-deleted).
    const existingBySus = await this.patientRepository.findBySusCardNumber(
      input.susCardNumber,
      true
    );

    if (existingBySus && !existingBySus.deletedAt) {
      throw new ConflictError(
        `Já existe um paciente com número do cartão do SUS ${input.susCardNumber} cadastrado e ativo.`
      );
    }

    // 4. Determine if we should restore an existing record or create a new one.
    // We prioritize the record found by CPF if both exist and are deleted (unlikely but possible).
    const deletedPatient = existingByCpf || existingBySus;

    if (deletedPatient) {
      const updaterId = userId ?? SYSTEM_CONSTANTS.DEFAULT_SYSTEM_USER_ID;
      // Perform restoration by updating the record and clearing deletedAt.
      const patient = await this.patientRepository.update(
        deletedPatient.id,
        {
          ...validation.data,
          birthDate: new Date(validation.data.birthDate),
          deletedAt: null,
        },
        updaterId
      );

      // 5. Audit the RESTORE action.
      await this.auditLogRepository.create({
        userId: userId ?? SYSTEM_CONSTANTS.DEFAULT_SYSTEM_USER_ID,
        action: 'RESTORE',
        entityName: 'PATIENT',
        entityId: patient.id,
        newValues: input,
        ipAddress,
        userAgent,
      });

      return patient;
    }

    // 6. Create a new patient record if no existing record (active or deleted) was found.
    const patient = await this.patientRepository.create({
      ...validation.data,
      birthDate: new Date(validation.data.birthDate),
      createdBy: userId ?? SYSTEM_CONSTANTS.DEFAULT_SYSTEM_USER_ID,
    });

    // 7. Audit the CREATE action.
    await this.auditLogRepository.create({
      userId: userId ?? SYSTEM_CONSTANTS.DEFAULT_SYSTEM_USER_ID,
      action: 'CREATE',
      entityName: 'PATIENT',
      entityId: patient.id,
      newValues: input,
      ipAddress,
      userAgent,
    });

    return patient;
  }
}
