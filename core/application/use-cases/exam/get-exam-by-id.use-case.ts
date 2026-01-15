import { NotFoundError } from '@/core/domain/errors/app.error';
import { ExamRepository } from '@/core/domain/repositories/exam.repository';
import {
  GetExamByIdInput,
  GetExamByIdOutput,
} from '../../contracts/exam/get-exam-by-id.contract';
import { UseCase } from '../use-case.interface';

/**
 * Use case to retrieve an exam by ID.
 */
export class GetExamByIdUseCase implements UseCase<
  GetExamByIdInput,
  GetExamByIdOutput
> {
  constructor(private readonly examRepository: ExamRepository) {}

  async execute(input: GetExamByIdInput): Promise<GetExamByIdOutput> {
    // 1. Find the exam by ID.
    const exam = await this.examRepository.findById(input.id);
    if (!exam) {
      throw new NotFoundError('Exam not found');
    }

    return exam;
  }
}
