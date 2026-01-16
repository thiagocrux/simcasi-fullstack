'use server';

import { revalidatePath } from 'next/cache';

import { IdSchema } from '@/core/application/validation/schemas/common.schema';
import {
  CreateObservationInput,
  UpdateObservationInput,
  observationSchema,
} from '@/core/application/validation/schemas/observation.schema';
import { ValidationError } from '@/core/domain/errors/app.error';
import {
  makeDeleteObservationUseCase,
  makeFindObservationsUseCase,
  makeGetObservationByIdUseCase,
  makeRegisterObservationUseCase,
  makeUpdateObservationUseCase,
} from '@/core/infrastructure/factories/observation.factory';
import { withSecuredActionAndAutomaticRetry } from '@/lib/actions.utils';

export async function getAllObservations() {
  return withSecuredActionAndAutomaticRetry(['read:observation'], async () => {
    // 1. Initialize use case.
    const findObservationsUseCase = makeFindObservationsUseCase();

    // 2. Execute use case.
    return await findObservationsUseCase.execute({});
  });
}

export async function getObservation(id: string) {
  return withSecuredActionAndAutomaticRetry(['read:observation'], async () => {
    // 1. Validate ID input.
    const parsed = IdSchema.safeParse(id);

    if (!parsed.success) {
      throw new ValidationError(
        'ID inválido',
        parsed.error.flatten().fieldErrors
      );
    }

    // 2. Initialize use case.
    const getObservationByIdUseCase = makeGetObservationByIdUseCase();

    // 3. Execute use case.
    return await getObservationByIdUseCase.execute({
      id: parsed.data,
    });
  });
}

export async function createObservation(input: CreateObservationInput) {
  return withSecuredActionAndAutomaticRetry(
    ['create:observation'],
    async ({ userId, ipAddress, userAgent }) => {
      // 1. Validate form input.
      const parsed = observationSchema.safeParse(input);

      if (!parsed.success) {
        throw new ValidationError(
          'Dados da observação inválidos',
          parsed.error.flatten().fieldErrors
        );
      }

      // 2. Initialize use case.
      const registerObservationUseCase = makeRegisterObservationUseCase();

      // 3. Execute use case with audit data.
      const observation = await registerObservationUseCase.execute({
        ...parsed.data,
        userId,
        ipAddress,
        userAgent,
      });

      // 4. Revalidate cache.
      revalidatePath(`/patients/${input.patientId}/observations`);
      revalidatePath('/observations');

      return observation;
    }
  );
}

export async function updateObservation(
  id: string,
  input: UpdateObservationInput
) {
  return withSecuredActionAndAutomaticRetry(
    ['update:observation'],
    async ({ userId, ipAddress, userAgent }) => {
      // 1. Validate form/ID input.
      const parsedId = IdSchema.safeParse(id);
      const parsedData = observationSchema.partial().safeParse(input);

      if (!parsedId.success) {
        throw new ValidationError(
          'ID inválido',
          parsedId.error.flatten().fieldErrors
        );
      }

      if (!parsedData.success) {
        throw new ValidationError(
          'Dados da observação inválidos',
          parsedData.error.flatten().fieldErrors
        );
      }

      // 2. Initialize use case.
      const updateObservationUseCase = makeUpdateObservationUseCase();

      // 3. Execute use case with audit data.
      const observation = await updateObservationUseCase.execute({
        ...parsedData.data,
        id: parsedId.data,
        userId,
        ipAddress,
        userAgent,
      });

      // 4. Revalidate cache.
      revalidatePath('/observations');

      return observation;
    }
  );
}

export async function deleteObservation(id: string) {
  return withSecuredActionAndAutomaticRetry(
    ['delete:observation'],
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
      const deleteObservationUseCase = makeDeleteObservationUseCase();

      // 3. Execute use case with audit data.
      await deleteObservationUseCase.execute({
        id: parsed.data,
        userId,
        ipAddress,
        userAgent,
      });

      // 4. Revalidate cache.
      revalidatePath('/observations');

      return { success: true };
    }
  );
}
