/* eslint-disable @typescript-eslint/no-explicit-any */
import { NotFoundError } from '@/core/domain/errors/app.error';
import { GetExamByIdUseCase } from './get-exam-by-id.use-case';

const mockExamRepository = {
  findById: jest.fn(),
};

describe('GetExamByIdUseCase', () => {
  let useCase: GetExamByIdUseCase;

  beforeEach(() => {
    jest.clearAllMocks();
    useCase = new GetExamByIdUseCase(mockExamRepository as any);
  });

  it('should return the exam when found', async () => {
    const exam = { id: 'exam-1', patientId: 'patient-1' };
    mockExamRepository.findById.mockResolvedValueOnce(exam);

    const result = await useCase.execute({ id: 'exam-1' });

    expect(result).toEqual(exam);
  });

  it('should throw NotFoundError when exam does not exist', async () => {
    mockExamRepository.findById.mockResolvedValueOnce(null);

    await expect(useCase.execute({ id: 'missing' })).rejects.toThrow(
      NotFoundError
    );
  });
});
