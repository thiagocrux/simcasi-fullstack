'use server';

import { revalidatePath } from 'next/cache';

import { IdSchema } from '@/core/application/validation/schemas/common.schema';
import {
  CreateExamInput,
  UpdateExamInput,
  examSchema,
} from '@/core/application/validation/schemas/exam.schema';
import { ValidationError } from '@/core/domain/errors/app.error';
import {
  makeDeleteExamUseCase,
  makeFindExamsUseCase,
  makeGetExamByIdUseCase,
  makeRegisterExamUseCase,
  makeUpdateExamUseCase,
} from '@/core/infrastructure/factories/exam.factory';
import { withSecuredActionAndAutomaticRetry } from '@/lib/actions.utils';

export async function getAllExams() {
  return withSecuredActionAndAutomaticRetry(['read:exam'], async () => {
    // 1. Initialize use case.
    const findExamsUseCase = makeFindExamsUseCase();

    // 2. Execute use case.
    return await findExamsUseCase.execute({});
  });
}

export async function getExam(id: string) {
  return withSecuredActionAndAutomaticRetry(['read:exam'], async () => {
    // 1. Validate ID input.
    const parsed = IdSchema.safeParse(id);

    if (!parsed.success) {
      throw new ValidationError(
        'ID inválido',
        parsed.error.flatten().fieldErrors
      );
    }

    // 2. Initialize use case.
    const getExamByIdUseCase = makeGetExamByIdUseCase();

    // 3. Execute use case.
    return await getExamByIdUseCase.execute({ id: parsed.data });
  });
}

export async function createExam(input: CreateExamInput) {
  return withSecuredActionAndAutomaticRetry(
    ['create:exam'],
    async ({ userId, ipAddress, userAgent }) => {
      // 1. Validate form input.
      const parsed = examSchema.safeParse(input);

      if (!parsed.success) {
        throw new ValidationError(
          'Dados do exame inválidos',
          parsed.error.flatten().fieldErrors
        );
      }

      // 2. Initialize use case.
      const registerExamUseCase = makeRegisterExamUseCase();

      // 3. Execute use case with audit data.
      const exam = await registerExamUseCase.execute({
        ...parsed.data,
        userId,
        ipAddress,
        userAgent,
      });

      // 4. Revalidate cache.
      revalidatePath(`/patients/${input.patientId}/exams`);
      revalidatePath('/exams');

      return exam;
    }
  );
}

export async function updateExam(id: string, input: UpdateExamInput) {
  return withSecuredActionAndAutomaticRetry(
    ['update:exam'],
    async ({ userId, ipAddress, userAgent }) => {
      // 1. Validate form/ID input.
      const parsedId = IdSchema.safeParse(id);
      const parsedData = examSchema.partial().safeParse(input);

      if (!parsedId.success) {
        throw new ValidationError(
          'ID inválido',
          parsedId.error.flatten().fieldErrors
        );
      }

      if (!parsedData.success) {
        throw new ValidationError(
          'Dados do exame inválidos',
          parsedData.error.flatten().fieldErrors
        );
      }

      // 2. Initialize use case.
      const updateExamUseCase = makeUpdateExamUseCase();

      // 3. Execute use case with audit data.
      const exam = await updateExamUseCase.execute({
        ...parsedData.data,
        id: parsedId.data,
        userId,
        ipAddress,
        userAgent,
      });

      // 4. Revalidate cache.
      revalidatePath('/exams');

      return exam;
    }
  );
}

export async function deleteExam(id: string) {
  return withSecuredActionAndAutomaticRetry(
    ['delete:exam'],
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
      const deleteExamUseCase = makeDeleteExamUseCase();

      // 3. Execute use case with audit data.
      await deleteExamUseCase.execute({
        id: parsed.data,
        userId,
        ipAddress,
        userAgent,
      });

      // 4. Revalidate cache.
      revalidatePath('/exams');

      return { success: true };
    }
  );
}
