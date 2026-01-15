import { NotFoundError } from '@/core/domain/errors/app.error';
import { ExamRepository } from '@/core/domain/repositories/exam.repository';
import {
  DeleteExamInput,
  DeleteExamOutput,
} from '../../contracts/exam/delete-exam.contract';
import { UseCase } from '../use-case.interface';

/**
 * Use case to soft delete an exam.
 */
export class DeleteExamUseCase implements UseCase<
  DeleteExamInput,
  DeleteExamOutput
> {
  constructor(private readonly examRepository: ExamRepository) {}

  async execute(input: DeleteExamInput): Promise<DeleteExamOutput> {
    // 1. Check if the exam exists.
    const exam = await this.examRepository.findById(input.id);
    if (!exam) {
      throw new NotFoundError('Exam not found');
    }

    // 2. Soft delete the exam.
    await this.examRepository.softDelete(input.id);
  }
}
