'use server';

import { revalidatePath } from 'next/cache';

import { IdSchema } from '@/core/application/validation/schemas/common.schema';
import {
  CreateTreatmentInput,
  TreatmentQueryInput,
  UpdateTreatmentInput,
  treatmentQuerySchema,
  treatmentSchema,
} from '@/core/application/validation/schemas/treatment.schema';
import { formatZodError } from '@/core/application/validation/zod.utils';
import { ValidationError } from '@/core/domain/errors/app.error';
import {
  makeDeleteTreatmentUseCase,
  makeFindTreatmentsUseCase,
  makeGetTreatmentByIdUseCase,
  makeRegisterTreatmentUseCase,
  makeUpdateTreatmentUseCase,
} from '@/core/infrastructure/factories/treatment.factory';
import { withSecuredActionAndAutomaticRetry } from '@/lib/actions.utils';

/**
 * Retrieves a paginated list of treatment records with optional filtering.
 * @param query Criteria for filtering and pagination.
 * @return A promise resolving to the treatments and metadata.
 */
export async function findTreatments(query?: TreatmentQueryInput) {
  return withSecuredActionAndAutomaticRetry(['read:treatment'], async () => {
    const parsed = treatmentQuerySchema.safeParse(query);
    const findTreatmentsUseCase = makeFindTreatmentsUseCase();
    return await findTreatmentsUseCase.execute(parsed.data || {});
  });
}

/**
 * Retrieves a single treatment record by its unique identifier.
 * @param id The UUID of the treatment.
 * @return A promise resolving to the treatment data.
 * @throws ValidationError If the ID is invalid.
 */
export async function getTreatment(id: string) {
  return withSecuredActionAndAutomaticRetry(['read:treatment'], async () => {
    const parsed = IdSchema.safeParse(id);
    if (!parsed.success) {
      throw new ValidationError('Invalid ID.', formatZodError(parsed.error));
    }

    const getTreatmentByIdUseCase = makeGetTreatmentByIdUseCase();
    return await getTreatmentByIdUseCase.execute({
      id: parsed.data,
    });
  });
}

/**
 * Registers a new treatment record in the system.
 * Handles revalidation for the active patient treatments view.
 * @param input The treatment data to register.
 * @return A promise resolving to the created treatment record.
 * @throws ValidationError If the treatment data is invalid.
 */
export async function createTreatment(input: CreateTreatmentInput) {
  return withSecuredActionAndAutomaticRetry(
    ['create:treatment'],
    async ({ userId, ipAddress, userAgent }) => {
      const parsed = treatmentSchema.safeParse(input);
      if (!parsed.success) {
        throw new ValidationError(
          'Dados do tratamento inválidos',
          formatZodError(parsed.error)
        );
      }

      const registerTreatmentUseCase = makeRegisterTreatmentUseCase();
      const treatment = await registerTreatmentUseCase.execute({
        ...parsed.data,
        userId,
        ipAddress,
        userAgent,
      });

      revalidatePath(`/patients/${input.patientId}/treatments`);
      revalidatePath('/treatments');

      return treatment;
    }
  );
}

/**
 * Updates an existing treatment record.
 * @param id The UUID of the treatment record.
 * @param input The updated data fields.
 * @return A promise resolving to the updated treatment.
 * @throws ValidationError If input data or ID is invalid.
 */
export async function updateTreatment(id: string, input: UpdateTreatmentInput) {
  return withSecuredActionAndAutomaticRetry(
    ['update:treatment'],
    async ({ userId, ipAddress, userAgent }) => {
      const parsedId = IdSchema.safeParse(id);
      const parsedData = treatmentSchema.partial().safeParse(input);
      if (!parsedId.success) {
        throw new ValidationError(
          'Invalid ID.',
          formatZodError(parsedId.error)
        );
      }

      if (!parsedData.success) {
        throw new ValidationError(
          'Dados do tratamento inválidos',
          formatZodError(parsedData.error)
        );
      }

      const updateTreatmentUseCase = makeUpdateTreatmentUseCase();
      const treatment = await updateTreatmentUseCase.execute({
        ...parsedData.data,
        id: parsedId.data,
        userId,
        ipAddress,
        userAgent,
      });

      revalidatePath('/treatments');

      return treatment;
    }
  );
}

/**
 * Performs a soft delete on a treatment record.
 * @param id The UUID of the treatment to delete.
 * @return A success object upon completion.
 * @throws ValidationError If the ID is invalid.
 */
export async function deleteTreatment(id: string) {
  return withSecuredActionAndAutomaticRetry(
    ['delete:treatment'],
    async ({ userId, ipAddress, userAgent }) => {
      const parsed = IdSchema.safeParse(id);
      if (!parsed.success) {
        throw new ValidationError('Invalid ID.', formatZodError(parsed.error));
      }

      const deleteTreatmentUseCase = makeDeleteTreatmentUseCase();
      await deleteTreatmentUseCase.execute({
        id: parsed.data,
        userId,
        ipAddress,
        userAgent,
      });

      revalidatePath('/treatments');

      return { success: true };
    }
  );
}
