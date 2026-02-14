import { patientSchema } from '@/core/application/validation/schemas/patient.schema';
import { formatZodError } from '@/core/application/validation/zod.utils';
import { SYSTEM_CONSTANTS } from '@/core/domain/constants/system.constants';
import {
  ConflictError,
  NotFoundError,
  ValidationError,
} from '@/core/domain/errors/app.error';
import { AuditLogRepository } from '@/core/domain/repositories/audit-log.repository';
import { PatientRepository } from '@/core/domain/repositories/patient.repository';
import {
  UpdatePatientInput,
  UpdatePatientOutput,
} from '../../contracts/patient/update-patient.contract';
import { UseCase } from '../use-case.interface';

/**
 * Use case to update an existing patient's information.
 */
export class UpdatePatientUseCase implements UseCase<
  UpdatePatientInput,
  UpdatePatientOutput
> {
  /**
   * Initializes a new instance of the UpdatePatientUseCase class.
   *
   * @param patientRepository The repository for patient persistence.
   * @param auditLogRepository The repository for audit logging.
   */
  constructor(
    private readonly patientRepository: PatientRepository,
    private readonly auditLogRepository: AuditLogRepository
  ) {}

  /**
   * Executes the use case to update an existing patient.
   *
   * @param input The data to update the patient.
   * @return A promise that resolves to the updated patient.
   * @throws {ValidationError} If the input data is invalid.
   * @throws {NotFoundError} If the patient is not found.
   * @throws {ConflictError} If the new CPF or SUS card is already in use.
   */
  async execute(input: UpdatePatientInput): Promise<UpdatePatientOutput> {
    const { id, userId, ipAddress, userAgent, ...data } = input;

    // 1. Validate input.
    const validation = patientSchema.partial().safeParse(data);
    if (!validation.success) {
      throw new ValidationError(
        'Dados de atualização de observação inválidos.',
        formatZodError(validation.error)
      );
    }

    // 2. Check if patient exists.
    const existing = await this.patientRepository.findById(id);
    if (!existing) {
      throw new NotFoundError('Paciente');
    }

    // 3. If CPF is being updated, check if the new CPF is already in use.
    if (validation.data.cpf && validation.data.cpf !== existing.cpf) {
      const duplicateCpf = await this.patientRepository.findByCpf(
        validation.data.cpf
      );
      if (duplicateCpf) {
        throw new ConflictError(
          `Já existe um paciente de CPF ${validation.data.cpf} cadastrado e ativo.`
        );
      }
    }

    // 4. Delegate update to repository.
    const updated = await this.patientRepository.update(
      id,
      {
        ...validation.data,
        birthDate: validation.data.birthDate
          ? new Date(validation.data.birthDate)
          : undefined,
      },
      userId ?? SYSTEM_CONSTANTS.DEFAULT_SYSTEM_USER_ID
    );

    // 5. Audit the update.
    await this.auditLogRepository.create({
      userId: userId ?? SYSTEM_CONSTANTS.DEFAULT_SYSTEM_USER_ID,
      action: 'UPDATE',
      entityName: 'PATIENT',
      entityId: id,
      oldValues: existing,
      newValues: validation.data,
      ipAddress,
      userAgent,
    });

    return updated;
  }
}
