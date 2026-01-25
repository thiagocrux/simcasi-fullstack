'use server';

import { revalidatePath } from 'next/cache';

import { DeletePatientOutput } from '@/core/application/contracts/patient/delete-patient.contract';
import { FindPatientsOutput } from '@/core/application/contracts/patient/find-patients.contract';
import { GetPatientOutput } from '@/core/application/contracts/patient/get-patient-by-id.contract';
import { RegisterPatientOutput } from '@/core/application/contracts/patient/register-patient.contract';
import { UpdatePatientOutput } from '@/core/application/contracts/patient/update-patient.contract';
import {
  IdSchema,
  QueryInput,
  QuerySchema,
} from '@/core/application/validation/schemas/common.schema';
import {
  CreatePatientInput,
  UpdatePatientInput,
  patientSchema,
} from '@/core/application/validation/schemas/patient.schema';
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
 * Fetch a paginated list of patients with optional search filtering.
 */
export async function findPatients(
  query?: QueryInput
): Promise<ActionResponse<FindPatientsOutput>> {
  return withSecuredActionAndAutomaticRetry(['read:patient'], async () => {
    // 1. Validate query input.
    const parsed = QuerySchema.safeParse(query);

    // 2. Initialize use case.
    const useCase = makeFindPatientsUseCase();

    // 3. Execute use case.
    return await useCase.execute(parsed.data || {});
  });
}

/**
 * Retrieve detailed information for a single patient by their unique ID.
 */
export async function getPatient(
  id: string
): Promise<ActionResponse<GetPatientOutput>> {
  return withSecuredActionAndAutomaticRetry(['read:patient'], async () => {
    const parsed = IdSchema.safeParse(id);

    if (!parsed.success) {
      throw new ValidationError(
        'ID inválido',
        parsed.error.flatten().fieldErrors
      );
    }

    const useCase = makeGetPatientByIdUseCase();
    return await useCase.execute({ id: parsed.data });
  });
}

/**
 * Register a new patient in the system.
 * Handles automatic restoration if a record with the same CPF or SUS card was previously soft-deleted.
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
          parsed.error.flatten().fieldErrors
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
 * Update an existing patient's demographic or contact information.
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
          'ID inválido',
          parsedId.error.flatten().fieldErrors
        );
      }

      if (!parsedData.success) {
        throw new ValidationError(
          'Dados de atualização inválidos',
          parsedData.error.flatten().fieldErrors
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
 * Delete a patient and their related health records (soft-delete).
 */
export async function deletePatient(
  id: string
): Promise<ActionResponse<DeletePatientOutput>> {
  return withSecuredActionAndAutomaticRetry(
    ['delete:patient'],
    async ({ userId, ipAddress, userAgent }) => {
      const parsed = IdSchema.safeParse(id);

      if (!parsed.success) {
        throw new ValidationError(
          'ID inválido',
          parsed.error.flatten().fieldErrors
        );
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
 * Restore a soft-deleted patient and their previously associated health records.
 */
export async function restorePatient(id: string) {
  return withSecuredActionAndAutomaticRetry(
    ['update:patient'],
    async ({ userId, ipAddress, userAgent }) => {
      const parsed = IdSchema.safeParse(id);

      if (!parsed.success) {
        throw new ValidationError(
          'ID inválido',
          parsed.error.flatten().fieldErrors
        );
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
