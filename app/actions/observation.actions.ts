'use server';

import { revalidatePath } from 'next/cache';

import { FindObservationsOutput } from '@/core/application/contracts/observation/find-observations.contract';
import { GetObservationByIdOutput } from '@/core/application/contracts/observation/get-observation-by-id.contract';
import { RegisterObservationOutput } from '@/core/application/contracts/observation/register-observation.contract';
import { UpdateObservationOutput } from '@/core/application/contracts/observation/update-observation.contract';
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
import {
  ActionResponse,
  withSecuredActionAndAutomaticRetry,
} from '@/lib/actions.utils';

/**
 * Retrieves a paginated list of observation records with optional filtering.
 * @param query Criteria for filtering and pagination.
 * @return A promise resolving to the observations and metadata.
 */
export async function findObservations(
  query?: ObservationQueryInput
): Promise<ActionResponse<FindObservationsOutput>> {
  return withSecuredActionAndAutomaticRetry(['read:observation'], async () => {
    const parsed = observationQuerySchema.safeParse(query);
    const useCase = makeFindObservationsUseCase();
    return await useCase.execute(parsed.data || {});
  });
}

/**
 * Retrieves a single observation record by its unique identifier.
 * @param id The UUID of the observation.
 * @return A promise resolving to the observation data.
 * @throws ValidationError If the ID is invalid.
 */
export async function getObservation(
  id: string
): Promise<ActionResponse<GetObservationByIdOutput>> {
  return withSecuredActionAndAutomaticRetry(['read:observation'], async () => {
    const parsed = IdSchema.safeParse(id);
    if (!parsed.success) {
      throw new ValidationError('ID inválido.', formatZodError(parsed.error));
    }

    const useCase = makeGetObservationByIdUseCase();
    return await useCase.execute({
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
export async function createObservation(
  input: CreateObservationInput
): Promise<ActionResponse<RegisterObservationOutput>> {
  return withSecuredActionAndAutomaticRetry(
    ['create:observation'],
    async () => {
      const parsed = observationSchema.safeParse(input);
      if (!parsed.success) {
        throw new ValidationError(
          'Dados da observação inválidos',
          formatZodError(parsed.error)
        );
      }

      const useCase = makeRegisterObservationUseCase();
      const observation = await useCase.execute({
        ...parsed.data,
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
): Promise<ActionResponse<UpdateObservationOutput>> {
  return withSecuredActionAndAutomaticRetry(
    ['update:observation'],
    async () => {
      const parsedId = IdSchema.safeParse(id);
      const parsedData = observationSchema.partial().safeParse(input);
      if (!parsedId.success) {
        throw new ValidationError(
          'ID inválido.',
          formatZodError(parsedId.error)
        );
      }

      if (!parsedData.success) {
        throw new ValidationError(
          'Dados da observação inválidos',
          formatZodError(parsedData.error)
        );
      }

      const useCase = makeUpdateObservationUseCase();
      const observation = await useCase.execute({
        ...parsedData.data,
        id: parsedId.data,
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
export async function deleteObservation(
  id: string
): Promise<ActionResponse<{ success: boolean }>> {
  return withSecuredActionAndAutomaticRetry(
    ['delete:observation'],
    async () => {
      const parsed = IdSchema.safeParse(id);
      if (!parsed.success) {
        throw new ValidationError('ID inválido.', formatZodError(parsed.error));
      }

      const useCase = makeDeleteObservationUseCase();
      await useCase.execute({
        id: parsed.data,
      });

      revalidatePath('/observations');
      return { success: true };
    }
  );
}
