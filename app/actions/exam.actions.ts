'use server';

import { revalidatePath } from 'next/cache';

import { FindExamsOutput } from '@/core/application/contracts/exam/find-exams.contract';
import { GetExamByIdOutput } from '@/core/application/contracts/exam/get-exam-by-id.contract';
import { RegisterExamOutput } from '@/core/application/contracts/exam/register-exam.contract';
import { UpdateExamOutput } from '@/core/application/contracts/exam/update-exam.contract';
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
import {
  ActionResponse,
  withSecuredActionAndAutomaticRetry,
} from '@/lib/actions.utils';

/**
 * Retrieves a paginated list of exam records with optional filtering.
 * @param query Optional filtering and pagination parameters.
 * @return A promise resolving to the list of exams and metadata.
 */
export async function findExams(
  query?: ExamQueryInput
): Promise<ActionResponse<FindExamsOutput>> {
  return withSecuredActionAndAutomaticRetry(['read:exam'], async () => {
    const parsed = examQuerySchema.safeParse(query);
    const useCase = makeFindExamsUseCase();
    return await useCase.execute(parsed.data || {});
  });
}

/**
 * Retrieves a single exam record by its unique identifier.
 * @param id The UUID of the exam record.
 * @return A promise resolving to the exam data.
 * @throws ValidationError If the provided ID is invalid.
 */
export async function getExam(
  id: string
): Promise<ActionResponse<GetExamByIdOutput>> {
  return withSecuredActionAndAutomaticRetry(['read:exam'], async () => {
    const parsed = IdSchema.safeParse(id);
    if (!parsed.success) {
      throw new ValidationError('ID inválido.', formatZodError(parsed.error));
    }

    const useCase = makeGetExamByIdUseCase();
    return await useCase.execute({ id: parsed.data });
  });
}

/**
 * Registers a new exam record in the system.
 * Handles cache revalidation for both the direct exams list and patient-specific history.
 * @param input The laboratory test data to register.
 * @return A promise resolving to the created exam record.
 * @throws ValidationError If the exam data is malformed.
 */
export async function createExam(
  input: CreateExamInput
): Promise<ActionResponse<RegisterExamOutput>> {
  return withSecuredActionAndAutomaticRetry(['create:exam'], async () => {
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
    });

    revalidatePath(`/patients/${input.patientId}/exams`);
    revalidatePath('/exams');
    return exam;
  });
}

/**
 * Updates an existing exam record.
 * @param id The UUID of the exam record to update.
 * @param input The updated data fields.
 * @return A promise resolving to the updated exam record.
 */
export async function updateExam(
  id: string,
  input: UpdateExamInput
): Promise<ActionResponse<UpdateExamOutput>> {
  return withSecuredActionAndAutomaticRetry(['update:exam'], async () => {
    const parsedId = IdSchema.safeParse(id);
    const parsedData = examSchema.partial().safeParse(input);
    if (!parsedId.success) {
      throw new ValidationError('ID inválido.', formatZodError(parsedId.error));
    }

    if (!parsedData.success) {
      throw new ValidationError(
        'Dados do exame inválidos',
        formatZodError(parsedData.error)
      );
    }

    const useCase = makeUpdateExamUseCase();
    const exam = await useCase.execute({
      ...parsedData.data,
      id: parsedId.data,
    });

    revalidatePath('/exams');
    return exam;
  });
}

/**
 * Performs a soft delete on an exam record.
 * @param id The UUID of the exam to delete.
 * @return A success object upon completion.
 */
export async function deleteExam(
  id: string
): Promise<ActionResponse<{ success: boolean }>> {
  return withSecuredActionAndAutomaticRetry(['delete:exam'], async () => {
    const parsed = IdSchema.safeParse(id);
    if (!parsed.success) {
      throw new ValidationError('ID inválido.', formatZodError(parsed.error));
    }

    const useCase = makeDeleteExamUseCase();
    await useCase.execute({
      id: parsed.data,
    });

    revalidatePath('/exams');
    return { success: true };
  });
}
