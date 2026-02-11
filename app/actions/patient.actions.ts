'use server';

import { revalidatePath } from 'next/cache';

import { DeletePatientOutput } from '@/core/application/contracts/patient/delete-patient.contract';
import { FindPatientsOutput } from '@/core/application/contracts/patient/find-patients.contract';
import { GetPatientOutput } from '@/core/application/contracts/patient/get-patient-by-id.contract';
import { RegisterPatientOutput } from '@/core/application/contracts/patient/register-patient.contract';
import { UpdatePatientOutput } from '@/core/application/contracts/patient/update-patient.contract';
import { IdSchema } from '@/core/application/validation/schemas/common.schema';
import {
  CreatePatientInput,
  PatientQueryInput,
  UpdatePatientInput,
  patientQuerySchema,
  patientSchema,
} from '@/core/application/validation/schemas/patient.schema';
import { formatZodError } from '@/core/application/validation/zod.utils';
import { ValidationError } from '@/core/domain/errors/app.error';
import {
  makeDeletePatientUseCase,
  makeFindPatientsUseCase,
  makeGetPatientByIdUseCase,
  makeRegisterPatientUseCase,
  makeRestorePatientUseCase,
  makeUpdatePatientUseCase,
} from '@/core/infrastructure/factories/patient.factory';
import {
  ActionResponse,
  withSecuredActionAndAutomaticRetry,
} from '@/lib/actions.utils';

/**
 * Retrieves a paginated list of patient records with optional filtering.
 * @param query Optional filtering and pagination parameters.
 * @return A promise resolving to the list of patients and pagination metadata.
 */
export async function findPatients(
  query?: PatientQueryInput
): Promise<ActionResponse<FindPatientsOutput>> {
  return withSecuredActionAndAutomaticRetry(['read:patient'], async () => {
    const parsed = patientQuerySchema.safeParse(query);
    const useCase = makeFindPatientsUseCase();
    return await useCase.execute(parsed.data || {});
  });
}

/**
 * Retrieves a single patient record by its unique identifier.
 * @param id The UUID of the patient to retrieve.
 * @return A promise resolving to the patient data.
 * @throws ValidationError If the provided ID is invalid.
 */
export async function getPatient(
  id: string
): Promise<ActionResponse<GetPatientOutput>> {
  return withSecuredActionAndAutomaticRetry(['read:patient'], async () => {
    const parsed = IdSchema.safeParse(id);
    if (!parsed.success) {
      throw new ValidationError('Invalid ID.', formatZodError(parsed.error));
    }

    const useCase = makeGetPatientByIdUseCase();
    return await useCase.execute({ id: parsed.data });
  });
}

/**
 * Registers a new patient record in the system.
 * Handles revalidation of the patients list path upon success.
 * @param input The data required to register a new patient.
 * @return A promise resolving to the created patient record.
 * @throws ValidationError If the patient data fails validation.
 */
export async function createPatient(
  input: CreatePatientInput
): Promise<ActionResponse<RegisterPatientOutput>> {
  return withSecuredActionAndAutomaticRetry(
    ['create:patient'],
    async ({ userId, ipAddress, userAgent }) => {
      const parsed = patientSchema.safeParse(input);
      if (!parsed.success) {
        throw new ValidationError(
          'Dados do paciente inválidos',
          formatZodError(parsed.error)
        );
      }

      const useCase = makeRegisterPatientUseCase();
      const patient = await useCase.execute({
        ...parsed.data,
        userId,
        ipAddress,
        userAgent,
      });

      revalidatePath('/patients');
      return patient;
    }
  );
}

/**
 * Updates an existing patient record.
 * @param id The UUID of the patient to update.
 * @param input The updated data fields.
 * @return A promise resolving to the updated patient record.
 */
export async function updatePatient(
  id: string,
  input: UpdatePatientInput
): Promise<ActionResponse<UpdatePatientOutput>> {
  return withSecuredActionAndAutomaticRetry(
    ['update:patient'],
    async ({ userId, ipAddress, userAgent }) => {
      const parsedId = IdSchema.safeParse(id);
      const parsedData = patientSchema.partial().safeParse(input);
      if (!parsedId.success) {
        throw new ValidationError(
          'Invalid ID.',
          formatZodError(parsedId.error)
        );
      }
      if (!parsedData.success) {
        throw new ValidationError(
          'Dados de atualização inválidos',
          formatZodError(parsedData.error)
        );
      }

      const useCase = makeUpdatePatientUseCase();
      const patient = await useCase.execute({
        id: parsedId.data,
        ...parsedData.data,
        userId,
        ipAddress,
        userAgent,
      });

      revalidatePath('/patients');
      return patient;
    }
  );
}

/**
 * Performs a soft delete on a patient and related medical records.
 * @param id The UUID of the patient to delete.
 * @return A promise that resolves when the operation is complete.
 */
export async function deletePatient(
  id: string
): Promise<ActionResponse<DeletePatientOutput>> {
  return withSecuredActionAndAutomaticRetry(
    ['delete:patient'],
    async ({ userId, ipAddress, userAgent }) => {
      const parsed = IdSchema.safeParse(id);
      if (!parsed.success) {
        throw new ValidationError('Invalid ID.', formatZodError(parsed.error));
      }

      const useCase = makeDeletePatientUseCase();
      await useCase.execute({
        id: parsed.data,
        userId,
        ipAddress,
        userAgent,
      });

      revalidatePath('/patients');
    }
  );
}

/**
 * Restores a previously soft-deleted patient record and their associated history.
 * @param id The UUID of the patient to restore.
 * @return A promise that resolves when the restoration is complete.
 */
export async function restorePatient(id: string) {
  return withSecuredActionAndAutomaticRetry(
    ['update:patient'],
    async ({ userId, ipAddress, userAgent }) => {
      const parsed = IdSchema.safeParse(id);
      if (!parsed.success) {
        throw new ValidationError('Invalid ID.', formatZodError(parsed.error));
      }

      const useCase = makeRestorePatientUseCase();
      await useCase.execute({
        id: parsed.data,
        userId,
        ipAddress,
        userAgent,
      });

      revalidatePath('/patients');
    }
  );
}
