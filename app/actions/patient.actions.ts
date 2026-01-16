'use server';

import { IdSchema } from '@/core/application/validation/schemas/common.schema';
import {
  makeDeletePatientUseCase,
  makeFindPatientsUseCase,
  makeGetPatientByIdUseCase,
  makeRegisterPatientUseCase,
  makeUpdatePatientUseCase,
} from '@/core/infrastructure/factories/patient.factory';
import { handleActionError, protectAction } from '@/lib/action-utils';
import { revalidatePath } from 'next/cache';

import {
  CreatePatientInput,
  UpdatePatientInput,
  patientSchema,
} from '@/core/application/validation/schemas/patient.schema';

export async function getAllPatients() {
  try {
    // 1. Protect action with required permissions.
    await protectAction(['read:patient']);

    // 2. Initialize use case.
    const findPatientsUseCase = makeFindPatientsUseCase();

    // 3. Execute use case.
    const patients = await findPatientsUseCase.execute({});

    // 4. Return success result.
    return { success: true, data: patients };
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    return handleActionError(error);
  }
}

export async function getPatient(id: string) {
  // 1. Validate ID input.
  const parsed = IdSchema.safeParse(id);

  if (!parsed.success) {
    return { success: false, errors: parsed.error.flatten().fieldErrors };
  }

  try {
    // 2. Protect action with required permissions.
    await protectAction(['read:patient']);

    // 3. Initialize use case.
    const getPatientByIdUseCase = makeGetPatientByIdUseCase();

    // 4. Execute use case.
    const patient = await getPatientByIdUseCase.execute({ id: parsed.data });

    // 5. Return success result.
    return { success: true, data: patient };
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    return handleActionError(error);
  }
}

export async function registerPatient(input: CreatePatientInput) {
  try {
    // 1. Protect action and get audit metadata.
    const { userId, ipAddress, userAgent } = await protectAction([
      'create:patient',
    ]);

    // 2. Validate form input.
    const parsed = patientSchema.safeParse(input);

    if (!parsed.success) {
      return { success: false, errors: parsed.error.flatten().fieldErrors };
    }

    // 3. Initialize use case.
    const registerPatientUseCase = makeRegisterPatientUseCase();

    // 4. Execute use case with audit data.
    const patient = await registerPatientUseCase.execute({
      ...parsed.data,
      userId,
      ipAddress,
      userAgent,
    });

    // 5. Revalidate cache and return result.
    revalidatePath('/patients');
    return { success: true, data: patient };
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    return handleActionError(error);
  }
}

export async function updatePatient(id: string, input: UpdatePatientInput) {
  try {
    // 1. Protect action and get audit metadata.
    const { userId, ipAddress, userAgent } = await protectAction([
      'update:patient',
    ]);

    // 2. Validate form/ID input.
    const parsedId = IdSchema.safeParse(id);
    const parsedData = patientSchema.partial().safeParse(input);

    if (!parsedId.success) {
      return { success: false, errors: parsedId.error.flatten().fieldErrors };
    }

    if (!parsedData.success) {
      return { success: false, errors: parsedData.error.flatten().fieldErrors };
    }

    // 3. Initialize use case.
    const updatePatientUseCase = makeUpdatePatientUseCase();

    // 4. Execute use case with audit data.
    const patient = await updatePatientUseCase.execute({
      ...parsedData.data,
      id: parsedId.data,
      userId,
      ipAddress,
      userAgent,
    });

    // 5. Revalidate cache and return result.
    revalidatePath(`/patients/${parsedId.data}`);
    revalidatePath('/patients');
    return { success: true, data: patient };
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    return handleActionError(error);
  }
}

export async function deletePatient(id: string) {
  // 1. Validate ID input.
  const parsed = IdSchema.safeParse(id);

  if (!parsed.success) {
    return { success: false, errors: parsed.error.flatten().fieldErrors };
  }

  try {
    // 2. Protect action and get audit metadata.
    const { userId, ipAddress, userAgent } = await protectAction([
      'delete:patient',
    ]);

    // 3. Initialize use case.
    const deletePatientUseCase = makeDeletePatientUseCase();

    // 4. Execute use case with audit data.
    await deletePatientUseCase.execute({
      id: parsed.data,
      userId,
      ipAddress,
      userAgent,
    });

    // 5. Revalidate cache and return result.
    revalidatePath('/patients');
    return { success: true };
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    return handleActionError(error);
  }
}
