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
  makeUpdatePatientUseCase,
} from '@/core/infrastructure/factories/patient.factory';
import { withSecuredActionAndAutomaticRetry } from '@/lib/actions.utils';

export async function getAllPatients() {
  return withSecuredActionAndAutomaticRetry(['read:patient'], async () => {
    // 1. Initialize use case.
    const findPatientsUseCase = makeFindPatientsUseCase();

    // 2. Execute use case.
    return await findPatientsUseCase.execute({});
  });
}

export async function getPatient(id: string) {
  return withSecuredActionAndAutomaticRetry(['read:patient'], async () => {
    // 1. Validate ID input.
    const parsed = IdSchema.safeParse(id);

    if (!parsed.success) {
      throw new ValidationError(
        'ID inválido',
        parsed.error.flatten().fieldErrors
      );
    }

    // 2. Initialize use case.
    const getPatientByIdUseCase = makeGetPatientByIdUseCase();

    // 3. Execute use case.
    return await getPatientByIdUseCase.execute({ id: parsed.data });
  });
}

export async function createPatient(input: CreatePatientInput) {
  return withSecuredActionAndAutomaticRetry(
    ['create:patient'],
    async ({ userId, ipAddress, userAgent }) => {
      // 1. Validate form input.
      const parsed = patientSchema.safeParse(input);

      if (!parsed.success) {
        throw new ValidationError(
          'Dados do paciente inválidos',
          parsed.error.flatten().fieldErrors
        );
      }

      // 2. Initialize use case.
      const registerPatientUseCase = makeRegisterPatientUseCase();

      // 3. Execute use case with audit data.
      const patient = await registerPatientUseCase.execute({
        ...parsed.data,
        userId,
        ipAddress,
        userAgent,
      });

      // 4. Revalidate cache.
      revalidatePath('/patients');

      return patient;
    }
  );
}

export async function updatePatient(id: string, input: UpdatePatientInput) {
  return withSecuredActionAndAutomaticRetry(
    ['update:patient'],
    async ({ userId, ipAddress, userAgent }) => {
      // 1. Validate form/ID input.
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

      // 2. Initialize use case.
      const updatePatientUseCase = makeUpdatePatientUseCase();

      // 3. Execute use case with audit data.
      const patient = await updatePatientUseCase.execute({
        ...parsedData.data,
        id: parsedId.data,
        userId,
        ipAddress,
        userAgent,
      });

      // 4. Revalidate cache.
      revalidatePath(`/patients/${parsedId.data}`);
      revalidatePath('/patients');

      return patient;
    }
  );
}

export async function deletePatient(id: string) {
  return withSecuredActionAndAutomaticRetry(
    ['delete:patient'],
    async ({ userId, ipAddress, userAgent }) => {
      // 1. Validate ID input.
      const parsed = IdSchema.safeParse(id);

      if (!parsed.success) {
        throw new ValidationError(
          'ID inválido',
          parsed.error.flatten().fieldErrors
        );
      }

      // 2. Initialize use case.
      const deletePatientUseCase = makeDeletePatientUseCase();

      // 3. Execute use case with audit data.
      await deletePatientUseCase.execute({
        id: parsed.data,
        userId,
        ipAddress,
        userAgent,
      });

      // 4. Revalidate cache.
      revalidatePath('/patients');

      return { success: true };
    }
  );
}
