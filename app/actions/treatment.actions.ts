'use server';

import { revalidatePath } from 'next/cache';

import {
  IdSchema,
  QueryInput,
  QuerySchema,
} from '@/core/application/validation/schemas/common.schema';
import {
  CreateTreatmentInput,
  UpdateTreatmentInput,
  treatmentSchema,
} from '@/core/application/validation/schemas/treatment.schema';
import { ValidationError } from '@/core/domain/errors/app.error';
import {
  makeDeleteTreatmentUseCase,
  makeFindTreatmentsUseCase,
  makeGetTreatmentByIdUseCase,
  makeRegisterTreatmentUseCase,
  makeUpdateTreatmentUseCase,
} from '@/core/infrastructure/factories/treatment.factory';
import { withSecuredActionAndAutomaticRetry } from '@/lib/actions.utils';

export async function findTreatments(
  query?: QueryInput & { patientId?: string }
) {
  return withSecuredActionAndAutomaticRetry(['read:treatment'], async () => {
    // 1. Validate query input.
    const parsed = QuerySchema.extend({
      patientId: IdSchema.optional(),
    }).safeParse(query);

    // 2. Initialize use case.
    const findTreatmentsUseCase = makeFindTreatmentsUseCase();

    // 3. Execute use case.
    return await findTreatmentsUseCase.execute(parsed.data || {});
  });
}

export async function getTreatment(id: string) {
  return withSecuredActionAndAutomaticRetry(['read:treatment'], async () => {
    // 1. Validate ID input.
    const parsed = IdSchema.safeParse(id);

    if (!parsed.success) {
      throw new ValidationError(
        'ID inválido',
        parsed.error.flatten().fieldErrors
      );
    }

    // 2. Initialize use case.
    const getTreatmentByIdUseCase = makeGetTreatmentByIdUseCase();

    // 3. Execute use case.
    return await getTreatmentByIdUseCase.execute({
      id: parsed.data,
    });
  });
}

export async function createTreatment(input: CreateTreatmentInput) {
  return withSecuredActionAndAutomaticRetry(
    ['create:treatment'],
    async ({ userId, ipAddress, userAgent }) => {
      // 1. Validate form input.
      const parsed = treatmentSchema.safeParse(input);

      if (!parsed.success) {
        throw new ValidationError(
          'Dados do tratamento inválidos',
          parsed.error.flatten().fieldErrors
        );
      }

      // 2. Initialize use case.
      const registerTreatmentUseCase = makeRegisterTreatmentUseCase();

      // 3. Execute use case with audit data.
      const treatment = await registerTreatmentUseCase.execute({
        ...parsed.data,
        userId,
        ipAddress,
        userAgent,
      });

      // 4. Revalidate cache.
      revalidatePath(`/patients/${input.patientId}/treatments`);
      revalidatePath('/treatments');

      return treatment;
    }
  );
}

export async function updateTreatment(id: string, input: UpdateTreatmentInput) {
  return withSecuredActionAndAutomaticRetry(
    ['update:treatment'],
    async ({ userId, ipAddress, userAgent }) => {
      // 1. Validate form/ID input.
      const parsedId = IdSchema.safeParse(id);
      const parsedData = treatmentSchema.partial().safeParse(input);

      if (!parsedId.success) {
        throw new ValidationError(
          'ID inválido',
          parsedId.error.flatten().fieldErrors
        );
      }

      if (!parsedData.success) {
        throw new ValidationError(
          'Dados do tratamento inválidos',
          parsedData.error.flatten().fieldErrors
        );
      }

      // 2. Initialize use case.
      const updateTreatmentUseCase = makeUpdateTreatmentUseCase();

      // 3. Execute use case with audit data.
      const treatment = await updateTreatmentUseCase.execute({
        ...parsedData.data,
        id: parsedId.data,
        userId,
        ipAddress,
        userAgent,
      });

      // 4. Revalidate cache.
      revalidatePath('/treatments');

      return treatment;
    }
  );
}

export async function deleteTreatment(id: string) {
  return withSecuredActionAndAutomaticRetry(
    ['delete:treatment'],
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
      const deleteTreatmentUseCase = makeDeleteTreatmentUseCase();

      // 3. Execute use case with audit data.
      await deleteTreatmentUseCase.execute({
        id: parsed.data,
        userId,
        ipAddress,
        userAgent,
      });

      // 4. Revalidate cache.
      revalidatePath('/treatments');

      return { success: true };
    }
  );
}
