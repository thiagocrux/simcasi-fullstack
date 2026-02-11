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
  /**
   * Initializes a new instance of the GetExamByIdUseCase class.
   *
   * @param examRepository The repository for exam persistence.
   */
  constructor(private readonly examRepository: ExamRepository) {}

  /**
   * Executes the use case to get an exam by its ID.
   *
   * @param input The data containing the exam ID.
   * @return A promise that resolves to the found exam.
   * @throws {NotFoundError} If the exam is not found.
   */
  async execute(input: GetExamByIdInput): Promise<GetExamByIdOutput> {
    // 1. Find the exam by ID.
    const exam = await this.examRepository.findById(input.id);
    if (!exam) {
      throw new NotFoundError('Exam not found');
    }

    return exam;
  }
}
