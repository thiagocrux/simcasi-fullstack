'use server';

import { revalidatePath } from 'next/cache';

import { IdSchema } from '@/core/application/validation/schemas/common.schema';
import {
  CreateObservationInput,
  ObservationQueryInput,
  UpdateObservationInput,
  observationQuerySchema,
  observationSchema,
} from '@/core/application/validation/schemas/observation.schema';
import { formatZodError } from '@/core/application/validation/zod.utils';
import { ValidationError } from '@/core/domain/errors/app.error';
import {
  makeDeleteObservationUseCase,
  makeFindObservationsUseCase,
  makeGetObservationByIdUseCase,
  makeRegisterObservationUseCase,
  makeUpdateObservationUseCase,
} from '@/core/infrastructure/factories/observation.factory';
import { withSecuredActionAndAutomaticRetry } from '@/lib/actions.utils';

/**
 * Retrieves a paginated list of observation records with optional filtering.
 * @param query Criteria for filtering and pagination.
 * @return A promise resolving to the observations and metadata.
 */
export async function findObservations(query?: ObservationQueryInput) {
  return withSecuredActionAndAutomaticRetry(['read:observation'], async () => {
    const parsed = observationQuerySchema.safeParse(query);
    const findObservationsUseCase = makeFindObservationsUseCase();
    return await findObservationsUseCase.execute(parsed.data || {});
  });
}

/**
 * Retrieves a single observation record by its unique identifier.
 * @param id The UUID of the observation.
 * @return A promise resolving to the observation data.
 * @throws ValidationError If the ID is invalid.
 */
export async function getObservation(id: string) {
  return withSecuredActionAndAutomaticRetry(['read:observation'], async () => {
    const parsed = IdSchema.safeParse(id);
    if (!parsed.success) {
      throw new ValidationError('Invalid ID.', formatZodError(parsed.error));
    }

    const getObservationByIdUseCase = makeGetObservationByIdUseCase();
    return await getObservationByIdUseCase.execute({
      id: parsed.data,
    });
  });
}

/**
 * Registers a new observation record in the system.
 * Revalidates the patient-specific observation history.
 * @param input The observation data to create.
 * @return A promise resolving to the created observation.
 * @throws ValidationError If the input data is malformed.
 */
export async function createObservation(input: CreateObservationInput) {
  return withSecuredActionAndAutomaticRetry(
    ['create:observation'],
    async ({ userId, ipAddress, userAgent }) => {
      const parsed = observationSchema.safeParse(input);
      if (!parsed.success) {
        throw new ValidationError(
          'Dados da observação inválidos',
          formatZodError(parsed.error)
        );
      }

      const registerObservationUseCase = makeRegisterObservationUseCase();
      const observation = await registerObservationUseCase.execute({
        ...parsed.data,
        userId,
        ipAddress,
        userAgent,
      });

      revalidatePath(`/patients/${input.patientId}/observations`);
      revalidatePath('/observations');

      return observation;
    }
  );
}

/**
 * Updates an existing observation record.
 * @param id The UUID of the observation to update.
 * @param input The partial observation fields to modify.
 * @return A promise resolving to the updated observation.
 * @throws ValidationError If the update data or ID is invalid.
 */
export async function updateObservation(
  id: string,
  input: UpdateObservationInput
) {
  return withSecuredActionAndAutomaticRetry(
    ['update:observation'],
    async ({ userId, ipAddress, userAgent }) => {
      const parsedId = IdSchema.safeParse(id);
      const parsedData = observationSchema.partial().safeParse(input);
      if (!parsedId.success) {
        throw new ValidationError(
          'Invalid ID.',
          formatZodError(parsedId.error)
        );
      }

      if (!parsedData.success) {
        throw new ValidationError(
          'Dados da observação inválidos',
          formatZodError(parsedData.error)
        );
      }

      const updateObservationUseCase = makeUpdateObservationUseCase();
      const observation = await updateObservationUseCase.execute({
        ...parsedData.data,
        id: parsedId.data,
        userId,
        ipAddress,
        userAgent,
      });

      revalidatePath('/observations');

      return observation;
    }
  );
}

/**
 * Performs a soft delete on an observation record.
 * @param id The UUID of the observation to delete.
 * @return A success object upon completion.
 * @throws ValidationError If the ID is invalid.
 */
export async function deleteObservation(id: string) {
  return withSecuredActionAndAutomaticRetry(
    ['delete:observation'],
    async ({ userId, ipAddress, userAgent }) => {
      const parsed = IdSchema.safeParse(id);
      if (!parsed.success) {
        throw new ValidationError('Invalid ID.', formatZodError(parsed.error));
      }

      const deleteObservationUseCase = makeDeleteObservationUseCase();
      await deleteObservationUseCase.execute({
        id: parsed.data,
        userId,
        ipAddress,
        userAgent,
      });

      revalidatePath('/observations');

      return { success: true };
    }
  );
}
