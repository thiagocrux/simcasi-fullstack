'use server';

import { revalidatePath } from 'next/cache';

import { IdSchema } from '@/core/application/validation/schemas/common.schema';
import {
  CreateExamInput,
  ExamQueryInput,
  UpdateExamInput,
  examQuerySchema,
  examSchema,
} from '@/core/application/validation/schemas/exam.schema';
import { formatZodError } from '@/core/application/validation/zod.utils';
import { ValidationError } from '@/core/domain/errors/app.error';
import {
  makeDeleteExamUseCase,
  makeFindExamsUseCase,
  makeGetExamByIdUseCase,
  makeRegisterExamUseCase,
  makeUpdateExamUseCase,
} from '@/core/infrastructure/factories/exam.factory';
import { withSecuredActionAndAutomaticRetry } from '@/lib/actions.utils';

/**
 * Retrieves a paginated list of exam records with optional filtering.
 * @param query Optional filtering and pagination parameters.
 * @return A promise resolving to the list of exams and metadata.
 */
export async function findExams(query?: ExamQueryInput) {
  return withSecuredActionAndAutomaticRetry(['read:exam'], async () => {
    const parsed = examQuerySchema.safeParse(query);
    const findExamsUseCase = makeFindExamsUseCase();
    return await findExamsUseCase.execute(parsed.data || {});
  });
}

/**
 * Retrieves a single exam record by its unique identifier.
 * @param id The UUID of the exam record.
 * @return A promise resolving to the exam data.
 * @throws ValidationError If the provided ID is invalid.
 */
export async function getExam(id: string) {
  return withSecuredActionAndAutomaticRetry(['read:exam'], async () => {
    const parsed = IdSchema.safeParse(id);
    if (!parsed.success) {
      throw new ValidationError('Invalid ID.', formatZodError(parsed.error));
    }

    const getExamByIdUseCase = makeGetExamByIdUseCase();
    return await getExamByIdUseCase.execute({ id: parsed.data });
  });
}

/**
 * Registers a new exam record in the system.
 * Handles cache revalidation for both the direct exams list and patient-specific history.
 * @param input The laboratory test data to register.
 * @return A promise resolving to the created exam record.
 * @throws ValidationError If the exam data is malformed.
 */
export async function createExam(input: CreateExamInput) {
  return withSecuredActionAndAutomaticRetry(
    ['create:exam'],
    async ({ userId, ipAddress, userAgent }) => {
      const parsed = examSchema.safeParse(input);
      if (!parsed.success) {
        throw new ValidationError(
          'Dados do exame inválidos',
          formatZodError(parsed.error)
        );
      }

      const registerExamUseCase = makeRegisterExamUseCase();
      const exam = await registerExamUseCase.execute({
        ...parsed.data,
        userId,
        ipAddress,
        userAgent,
      });

      revalidatePath(`/patients/${input.patientId}/exams`);
      revalidatePath('/exams');

      return exam;
    }
  );
}

/**
 * Updates an existing exam record.
 * @param id The UUID of the exam record to update.
 * @param input The updated data fields.
 * @return A promise resolving to the updated exam record.
 */
export async function updateExam(id: string, input: UpdateExamInput) {
  return withSecuredActionAndAutomaticRetry(
    ['update:exam'],
    async ({ userId, ipAddress, userAgent }) => {
      const parsedId = IdSchema.safeParse(id);
      const parsedData = examSchema.partial().safeParse(input);
      if (!parsedId.success) {
        throw new ValidationError(
          'Invalid ID.',
          formatZodError(parsedId.error)
        );
      }

      if (!parsedData.success) {
        throw new ValidationError(
          'Dados do exame inválidos',
          formatZodError(parsedData.error)
        );
      }

      const updateExamUseCase = makeUpdateExamUseCase();
      const exam = await updateExamUseCase.execute({
        ...parsedData.data,
        id: parsedId.data,
        userId,
        ipAddress,
        userAgent,
      });

      revalidatePath('/exams');

      return exam;
    }
  );
}

/**
 * Performs a soft delete on an exam record.
 * @param id The UUID of the exam to delete.
 * @return A success object upon completion.
 */
export async function deleteExam(id: string) {
  return withSecuredActionAndAutomaticRetry(
    ['delete:exam'],
    async ({ userId, ipAddress, userAgent }) => {
      const parsed = IdSchema.safeParse(id);
      if (!parsed.success) {
        throw new ValidationError('Invalid ID.', formatZodError(parsed.error));
      }

      const deleteExamUseCase = makeDeleteExamUseCase();
      await deleteExamUseCase.execute({
        id: parsed.data,
        userId,
        ipAddress,
        userAgent,
      });

      revalidatePath('/exams');

      return { success: true };
    }
  );
}
