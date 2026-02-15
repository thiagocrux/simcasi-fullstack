'use server';

import { revalidatePath } from 'next/cache';

import { FindTreatmentsOutput } from '@/core/application/contracts/treatment/find-treatments.contract';
import { GetTreatmentByIdOutput } from '@/core/application/contracts/treatment/get-treatment-by-id.contract';
import { RegisterTreatmentOutput } from '@/core/application/contracts/treatment/register-treatment.contract';
import { UpdateTreatmentOutput } from '@/core/application/contracts/treatment/update-treatment.contract';
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
import {
  ActionResponse,
  withSecuredActionAndAutomaticRetry,
} from '@/lib/actions.utils';

/**
 * Retrieves a paginated list of treatment records with optional filtering.
 * @param query Criteria for filtering and pagination.
 * @return A promise resolving to the treatments and metadata.
 */
export async function findTreatments(
  query?: TreatmentQueryInput
): Promise<ActionResponse<FindTreatmentsOutput>> {
  return withSecuredActionAndAutomaticRetry(['read:treatment'], async () => {
    const parsed = treatmentQuerySchema.safeParse(query);
    const useCase = makeFindTreatmentsUseCase();
    return await useCase.execute(parsed.data || {});
  });
}

/**
 * Retrieves a single treatment record by its unique identifier.
 * @param id The UUID of the treatment.
 * @return A promise resolving to the treatment data.
 * @throws ValidationError If the ID is invalid.
 */
export async function getTreatment(
  id: string
): Promise<ActionResponse<GetTreatmentByIdOutput>> {
  return withSecuredActionAndAutomaticRetry(['read:treatment'], async () => {
    const parsed = IdSchema.safeParse(id);
    if (!parsed.success) {
      throw new ValidationError('ID inválido.', formatZodError(parsed.error));
    }

    const useCase = makeGetTreatmentByIdUseCase();
    return await useCase.execute({
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
export async function createTreatment(
  input: CreateTreatmentInput
): Promise<ActionResponse<RegisterTreatmentOutput>> {
  return withSecuredActionAndAutomaticRetry(['create:treatment'], async () => {
    const parsed = treatmentSchema.safeParse(input);
    if (!parsed.success) {
      throw new ValidationError(
        'Dados do tratamento inválidos',
        formatZodError(parsed.error)
      );
    }

    const useCase = makeRegisterTreatmentUseCase();
    const treatment = await useCase.execute({
      ...parsed.data,
    });

    revalidatePath(`/patients/${input.patientId}/treatments`);
    revalidatePath('/treatments');
    return treatment;
  });
}

/**
 * Updates an existing treatment record.
 * @param id The UUID of the treatment record.
 * @param input The updated data fields.
 * @return A promise resolving to the updated treatment.
 * @throws ValidationError If input data or ID is invalid.
 */
export async function updateTreatment(
  id: string,
  input: UpdateTreatmentInput
): Promise<ActionResponse<UpdateTreatmentOutput>> {
  return withSecuredActionAndAutomaticRetry(['update:treatment'], async () => {
    const parsedId = IdSchema.safeParse(id);
    const parsedData = treatmentSchema.partial().safeParse(input);
    if (!parsedId.success) {
      throw new ValidationError('ID inválido.', formatZodError(parsedId.error));
    }

    if (!parsedData.success) {
      throw new ValidationError(
        'Dados do tratamento inválidos',
        formatZodError(parsedData.error)
      );
    }

    const useCase = makeUpdateTreatmentUseCase();
    const treatment = await useCase.execute({
      ...parsedData.data,
      id: parsedId.data,
    });

    revalidatePath('/treatments');
    return treatment;
  });
}

/**
 * Performs a soft delete on a treatment record.
 * @param id The UUID of the treatment to delete.
 * @return A success object upon completion.
 * @throws ValidationError If the ID is invalid.
 */
export async function deleteTreatment(
  id: string
): Promise<ActionResponse<{ success: boolean }>> {
  return withSecuredActionAndAutomaticRetry(['delete:treatment'], async () => {
    const parsed = IdSchema.safeParse(id);
    if (!parsed.success) {
      throw new ValidationError('ID inválido.', formatZodError(parsed.error));
    }

    const useCase = makeDeleteTreatmentUseCase();
    await useCase.execute({
      id: parsed.data,
    });

    revalidatePath('/treatments');
    return { success: true };
  });
}
