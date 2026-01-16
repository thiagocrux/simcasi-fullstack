'use server';

import { revalidatePath } from 'next/cache';

import { IdSchema } from '@/core/application/validation/schemas/common.schema';
import {
  CreateExamInput,
  UpdateExamInput,
  examSchema,
} from '@/core/application/validation/schemas/exam.schema';
import {
  makeDeleteExamUseCase,
  makeFindExamsUseCase,
  makeGetExamByIdUseCase,
  makeRegisterExamUseCase,
  makeUpdateExamUseCase,
} from '@/core/infrastructure/factories/exam.factory';
import { handleActionError, protectAction } from '@/lib/action-utils';

export async function getAllExams() {
  try {
    // 1. Protect action with required permissions.
    await protectAction(['read:exam']);

    // 2. Initialize use case.
    const findExamsUseCase = makeFindExamsUseCase();

    // 3. Execute use case.
    const exams = await findExamsUseCase.execute({});

    // 4. Return success result.
    return { success: true, data: exams };
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    return handleActionError(error);
  }
}

export async function getExam(id: string) {
  // 1. Validate ID input.
  const parsed = IdSchema.safeParse(id);

  if (!parsed.success) {
    return { success: false, errors: parsed.error.flatten().fieldErrors };
  }

  try {
    // 2. Protect action with required permissions.
    await protectAction(['read:exam']);

    // 3. Initialize use case.
    const getExamByIdUseCase = makeGetExamByIdUseCase();

    // 4. Execute use case.
    const exam = await getExamByIdUseCase.execute({ id: parsed.data });

    // 5. Return success result.
    return { success: true, data: exam };
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    return handleActionError(error);
  }
}

export async function createExam(input: CreateExamInput) {
  try {
    // 1. Protect action and get audit metadata.
    const { userId, ipAddress, userAgent } = await protectAction([
      'create:exam',
    ]);

    // 2. Validate form input.
    const parsed = examSchema.safeParse(input);

    if (!parsed.success) {
      return { success: false, errors: parsed.error.flatten().fieldErrors };
    }

    // 3. Initialize use case.
    const registerExamUseCase = makeRegisterExamUseCase();

    // 4. Execute use case with audit data.
    const exam = await registerExamUseCase.execute({
      ...parsed.data,
      userId,
      ipAddress,
      userAgent,
    });

    // 5. Revalidate cache and return.
    revalidatePath(`/patients/${input.patientId}/exams`);
    revalidatePath('/exams');
    return { success: true, data: exam };
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    return handleActionError(error);
  }
}

export async function updateExam(id: string, input: UpdateExamInput) {
  try {
    // 1. Protect action and get audit metadata.
    const { userId, ipAddress, userAgent } = await protectAction([
      'update:exam',
    ]);

    // 2. Validate form/ID input.
    const parsedId = IdSchema.safeParse(id);
    const parsedData = examSchema.partial().safeParse(input);

    if (!parsedId.success) {
      return { success: false, errors: parsedId.error.flatten().fieldErrors };
    }

    if (!parsedData.success) {
      return { success: false, errors: parsedData.error.flatten().fieldErrors };
    }

    // 3. Initialize use case.
    const updateExamUseCase = makeUpdateExamUseCase();

    // 4. Execute use case with audit data.
    const exam = await updateExamUseCase.execute({
      ...parsedData.data,
      id: parsedId.data,
      userId,
      ipAddress,
      userAgent,
    });

    // 5. Revalidate cache and return.
    revalidatePath('/exams');
    return { success: true, data: exam };
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    return handleActionError(error);
  }
}

export async function deleteExam(id: string) {
  // 1. Validate ID input.
  const parsed = IdSchema.safeParse(id);

  if (!parsed.success) {
    return { success: false, errors: parsed.error.flatten().fieldErrors };
  }

  try {
    // 2. Protect action and get audit metadata.
    const { userId, ipAddress, userAgent } = await protectAction([
      'delete:exam',
    ]);

    // 3. Initialize use case.
    const deleteExamUseCase = makeDeleteExamUseCase();

    // 4. Execute use case with audit data.
    await deleteExamUseCase.execute({
      id: parsed.data,
      userId,
      ipAddress,
      userAgent,
    });

    // 5. Revalidate cache and return result.
    revalidatePath('/exams');
    return { success: true };
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    return handleActionError(error);
  }
}
