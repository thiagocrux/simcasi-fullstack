'use server';

import { revalidatePath } from 'next/cache';

import { IdSchema } from '@/core/application/validation/schemas/common.schema';
import {
  CreateObservationInput,
  UpdateObservationInput,
  observationSchema,
} from '@/core/application/validation/schemas/observation.schema';
import {
  makeDeleteObservationUseCase,
  makeFindObservationsUseCase,
  makeGetObservationByIdUseCase,
  makeRegisterObservationUseCase,
  makeUpdateObservationUseCase,
} from '@/core/infrastructure/factories/observation.factory';
import { handleActionError, protectAction } from '@/lib/action-utils';

export async function getAllObservations() {
  try {
    // 1. Protect action with required permissions.
    await protectAction(['read:observation']);

    // 2. Initialize use case.
    const findObservationsUseCase = makeFindObservationsUseCase();

    // 3. Execute use case.
    const observations = await findObservationsUseCase.execute({});

    // 4. Return success result.
    return { success: true, data: observations };
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    return handleActionError(error);
  }
}

export async function getObservation(id: string) {
  // 1. Validate ID input.
  const parsed = IdSchema.safeParse(id);

  if (!parsed.success) {
    return { success: false, errors: parsed.error.flatten().fieldErrors };
  }

  try {
    // 2. Protect action with required permissions.
    await protectAction(['read:observation']);

    // 3. Initialize use case.
    const getObservationByIdUseCase = makeGetObservationByIdUseCase();

    // 4. Execute use case.
    const observation = await getObservationByIdUseCase.execute({
      id: parsed.data,
    });

    // 5. Return success result.
    return { success: true, data: observation };
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    return handleActionError(error);
  }
}

export async function createObservation(input: CreateObservationInput) {
  try {
    // 1. Protect action and get audit metadata.
    const { userId, ipAddress, userAgent } = await protectAction([
      'create:observation',
    ]);

    // 2. Validate form input.
    const parsed = observationSchema.safeParse(input);

    if (!parsed.success) {
      return { success: false, errors: parsed.error.flatten().fieldErrors };
    }

    // 3. Initialize use case.
    const registerObservationUseCase = makeRegisterObservationUseCase();

    // 4. Execute use case with audit data.
    const observation = await registerObservationUseCase.execute({
      ...parsed.data,
      userId,
      ipAddress,
      userAgent,
    });

    // 5. Revalidate cache and return.
    revalidatePath(`/patients/${input.patientId}/observations`);
    revalidatePath('/observations');
    return { success: true, data: observation };
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    return handleActionError(error);
  }
}

export async function updateObservation(
  id: string,
  input: UpdateObservationInput
) {
  try {
    // 1. Protect action and get audit metadata.
    const { userId, ipAddress, userAgent } = await protectAction([
      'update:observation',
    ]);

    // 2. Validate form/ID input.
    const parsedId = IdSchema.safeParse(id);
    const parsedData = observationSchema.partial().safeParse(input);

    if (!parsedId.success) {
      return { success: false, errors: parsedId.error.flatten().fieldErrors };
    }

    if (!parsedData.success) {
      return { success: false, errors: parsedData.error.flatten().fieldErrors };
    }

    // 3. Initialize use case.
    const updateObservationUseCase = makeUpdateObservationUseCase();

    // 4. Execute use case with audit data.
    const observation = await updateObservationUseCase.execute({
      ...parsedData.data,
      id: parsedId.data,
      userId,
      ipAddress,
      userAgent,
    });

    // 5. Revalidate cache and return.
    revalidatePath('/observations');
    return { success: true, data: observation };
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    return handleActionError(error);
  }
}

export async function deleteObservation(id: string) {
  // 1. Validate ID input.
  const parsed = IdSchema.safeParse(id);

  if (!parsed.success) {
    return { success: false, errors: parsed.error.flatten().fieldErrors };
  }

  try {
    // 2. Protect action and get audit metadata.
    const { userId, ipAddress, userAgent } = await protectAction([
      'delete:observation',
    ]);

    // 3. Initialize use case.
    const deleteObservationUseCase = makeDeleteObservationUseCase();

    // 4. Execute use case with audit data.
    await deleteObservationUseCase.execute({
      id: parsed.data,
      userId,
      ipAddress,
      userAgent,
    });

    // 5. Revalidate cache and return result.
    revalidatePath('/observations');
    return { success: true };
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    return handleActionError(error);
  }
}
