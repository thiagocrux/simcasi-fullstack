import { ExamRepository } from '@/core/domain/repositories/exam.repository';
import {
  FindExamsInput,
  FindExamsOutput,
} from '../../contracts/exam/find-exams.contract';
import { UseCase } from '../use-case.interface';

/**
 * Use case to find exams with pagination and filters.
 */
export class FindExamsUseCase implements UseCase<
  FindExamsInput,
  FindExamsOutput
> {
  constructor(private readonly examRepository: ExamRepository) {}

  async execute(input: FindExamsInput): Promise<FindExamsOutput> {
    // 1. Find all exams based on input criteria.
    return this.examRepository.findAll(input);
  }
}
