import { NotFoundError } from '@/core/domain/errors/app.error';
import { ExamRepository } from '@/core/domain/repositories/exam.repository';
import {
  UpdateExamInput,
  UpdateExamOutput,
} from '../../contracts/exam/update-exam.contract';
import { UseCase } from '../use-case.interface';

/**
 * Use case to update an existing exam.
 */
export class UpdateExamUseCase implements UseCase<
  UpdateExamInput,
  UpdateExamOutput
> {
  constructor(private readonly examRepository: ExamRepository) {}

  async execute(input: UpdateExamInput): Promise<UpdateExamOutput> {
    const { id, ...data } = input;

    // 1. Check if the exam exists.
    const exam = await this.examRepository.findById(id);
    if (!exam) {
      throw new NotFoundError('Exam not found');
    }

    // 2. Update the exam.
    return this.examRepository.update(id, data);
  }
}
