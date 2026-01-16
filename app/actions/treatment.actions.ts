'use server';

import { IdSchema } from '@/core/application/validation/schemas/common.schema';
import {
  makeDeleteTreatmentUseCase,
  makeFindTreatmentsUseCase,
  makeGetTreatmentByIdUseCase,
  makeRegisterTreatmentUseCase,
  makeUpdateTreatmentUseCase,
} from '@/core/infrastructure/factories/treatment.factory';
import { handleActionError, protectAction } from '@/lib/action-utils';
import { revalidatePath } from 'next/cache';

import {
  CreateTreatmentInput,
  UpdateTreatmentInput,
  treatmentSchema,
} from '@/core/application/validation/schemas/treatment.schema';

export async function getAllTreatments() {
  try {
    // 1. Protect action with required permissions.
    await protectAction(['read:treatment']);

    // 2. Initialize use case.
    const findTreatmentsUseCase = makeFindTreatmentsUseCase();

    // 3. Execute use case.
    const treatments = await findTreatmentsUseCase.execute({});

    // 4. Return success result.
    return { success: true, data: treatments };
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    return handleActionError(error);
  }
}

export async function getTreatment(id: string) {
  // 1. Validate ID input.
  const parsed = IdSchema.safeParse(id);

  if (!parsed.success) {
    return { success: false, errors: parsed.error.flatten().fieldErrors };
  }

  try {
    // 2. Protect action with required permissions.
    await protectAction(['read:treatment']);

    // 3. Initialize use case.
    const getTreatmentByIdUseCase = makeGetTreatmentByIdUseCase();

    // 4. Execute use case.
    const treatment = await getTreatmentByIdUseCase.execute({
      id: parsed.data,
    });

    // 5. Return success result.
    return { success: true, data: treatment };
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    return handleActionError(error);
  }
}

export async function createTreatment(input: CreateTreatmentInput) {
  try {
    // 1. Protect action and get audit metadata.
    const { userId, ipAddress, userAgent } = await protectAction([
      'create:treatment',
    ]);

    // 2. Validate form input.
    const parsed = treatmentSchema.safeParse(input);

    if (!parsed.success) {
      return { success: false, errors: parsed.error.flatten().fieldErrors };
    }

    // 3. Initialize use case.
    const registerTreatmentUseCase = makeRegisterTreatmentUseCase();

    // 4. Execute use case with audit data.
    const treatment = await registerTreatmentUseCase.execute({
      ...parsed.data,
      userId,
      ipAddress,
      userAgent,
    });

    // 5. Revalidate cache and return.
    revalidatePath(`/patients/${input.patientId}/treatments`);
    revalidatePath('/treatments');
    return { success: true, data: treatment };
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    return handleActionError(error);
  }
}

export async function updateTreatment(id: string, input: UpdateTreatmentInput) {
  try {
    // 1. Protect action and get audit metadata.
    const { userId, ipAddress, userAgent } = await protectAction([
      'update:treatment',
    ]);

    // 2. Validate form/ID input.
    const parsedId = IdSchema.safeParse(id);
    const parsedData = treatmentSchema.partial().safeParse(input);

    if (!parsedId.success) {
      return { success: false, errors: parsedId.error.flatten().fieldErrors };
    }

    if (!parsedData.success) {
      return { success: false, errors: parsedData.error.flatten().fieldErrors };
    }

    // 3. Initialize use case.
    const updateTreatmentUseCase = makeUpdateTreatmentUseCase();

    // 4. Execute use case with audit data.
    const treatment = await updateTreatmentUseCase.execute({
      ...parsedData.data,
      id: parsedId.data,
      userId,
      ipAddress,
      userAgent,
    });

    // 5. Revalidate cache and return result.
    revalidatePath('/treatments');
    return { success: true, data: treatment };
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    return handleActionError(error);
  }
}

export async function deleteTreatment(id: string) {
  // 1. Validate ID input.
  const parsed = IdSchema.safeParse(id);

  if (!parsed.success) {
    return { success: false, errors: parsed.error.flatten().fieldErrors };
  }

  try {
    // 2. Protect action and get audit metadata.
    const { userId, ipAddress, userAgent } = await protectAction([
      'delete:treatment',
    ]);

    // 3. Initialize use case.
    const deleteTreatmentUseCase = makeDeleteTreatmentUseCase();

    // 4. Execute use case with audit data.
    await deleteTreatmentUseCase.execute({
      id: parsed.data,
      userId,
      ipAddress,
      userAgent,
    });

    // 5. Revalidate cache and return result.
    revalidatePath('/treatments');
    return { success: true };
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    return handleActionError(error);
  }
}
