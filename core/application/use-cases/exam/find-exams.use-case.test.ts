/* eslint-disable @typescript-eslint/no-explicit-any */
jest.mock('@/core/application/validation/schemas/exam.schema', () => ({
  examQuerySchema: {
    parse: jest.fn((input: any) => ({ skip: 0, take: 10, ...input })),
  },
}));

import { FindExamsUseCase } from './find-exams.use-case';

const mockExamRepository = { findAll: jest.fn() };
const mockUserRepository = { findByIds: jest.fn() };
const mockPatientRepository = { findByIds: jest.fn() };

describe('FindExamsUseCase', () => {
  let useCase: FindExamsUseCase;

  beforeEach(() => {
    jest.clearAllMocks();
    useCase = new FindExamsUseCase(
      mockExamRepository as any,
      mockUserRepository as any,
      mockPatientRepository as any
    );
  });

  it('should return paginated exams', async () => {
    const items = [{ id: 'exam-1', createdBy: 'u1', patientId: 'p1' }];
    mockExamRepository.findAll.mockResolvedValueOnce({ items, total: 1 });

    const result = await useCase.execute({});

    expect(result).toEqual({ items, total: 1 });
  });

  it('should enrich with related users and patients when requested', async () => {
    const items = [{ id: 'exam-1', createdBy: 'u1', patientId: 'p1' }];
    mockExamRepository.findAll.mockResolvedValueOnce({ items, total: 1 });
    mockUserRepository.findByIds.mockResolvedValueOnce([
      { id: 'u1', name: 'User', password: 'hash' },
    ]);
    mockPatientRepository.findByIds.mockResolvedValueOnce([
      { id: 'p1', name: 'Patient' },
    ]);

    const result = await useCase.execute({
      includeRelatedUsers: true,
      includeRelatedPatients: true,
    } as any);

    expect(result.relatedUsers).toEqual([{ id: 'u1', name: 'User' }]);
    expect(result.relatedPatients).toEqual([{ id: 'p1', name: 'Patient' }]);
  });
});
