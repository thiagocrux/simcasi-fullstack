import { NotFoundError } from '@/core/domain/errors/app.error';
import { ExamRepository } from '@/core/domain/repositories/exam.repository';
import {
  RestoreExamInput,
  RestoreExamOutput,
} from '../../contracts/exam/restore-exam.contract';
import { UseCase } from '../use-case.interface';

/**
 * Use case to restore a soft-deleted exam.
 */
export class RestoreExamUseCase implements UseCase<
  RestoreExamInput,
  RestoreExamOutput
> {
  constructor(private readonly examRepository: ExamRepository) {}

  async execute(input: RestoreExamInput): Promise<RestoreExamOutput> {
    // 1. Check if the exam exists (including deleted).
    const exam = await this.examRepository.findById(input.id, true);
    if (!exam) {
      throw new NotFoundError('Exam not found');
    }

    // 2. Perform the restoration if it was deleted.
    if (exam.deletedAt) {
      await this.examRepository.restore(input.id);
    }

    return (await this.examRepository.findById(input.id)) as RestoreExamOutput;
  }
}
