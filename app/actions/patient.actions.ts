'use server';

import { revalidatePath } from 'next/cache';

import { IdSchema } from '@/core/application/validation/schemas/common.schema';
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
import { withSecuredActionAndAutomaticRetry } from '@/lib/actions.utils';

/**
 * Fetch a paginated list of patients with optional search filtering.
 */
export async function getAllPatients(params?: {
  page?: number;
  limit?: number;
  search?: string;
  includeDeleted?: boolean;
}) {
  return withSecuredActionAndAutomaticRetry(['read:patient'], async () => {
    const useCase = makeFindPatientsUseCase();
    const skip =
      params?.page && params?.limit ? (params.page - 1) * params.limit : 0;
    const take = params?.limit || 20;

    return await useCase.execute({
      skip,
      take,
      search: params?.search,
      includeDeleted: params?.includeDeleted,
    });
  });
}

/**
 * Retrieve detailed information for a single patient by their unique ID.
 */
export async function getPatient(id: string) {
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
export async function createPatient(input: CreatePatientInput) {
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
export async function updatePatient(id: string, input: UpdatePatientInput) {
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
export async function deletePatient(id: string) {
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
