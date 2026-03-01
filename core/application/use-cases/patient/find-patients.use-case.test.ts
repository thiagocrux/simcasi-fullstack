/* eslint-disable @typescript-eslint/no-explicit-any */
jest.mock('@/core/application/validation/schemas/patient.schema', () => ({
  patientQuerySchema: {
    parse: jest.fn((input: any) => ({ skip: 0, take: 10, ...input })),
  },
}));

import { FindPatientsUseCase } from './find-patients.use-case';

const mockPatientRepository = { findAll: jest.fn() };
const mockUserRepository = { findByIds: jest.fn() };

describe('FindPatientsUseCase', () => {
  let useCase: FindPatientsUseCase;

  beforeEach(() => {
    jest.clearAllMocks();
    useCase = new FindPatientsUseCase(
      mockPatientRepository as any,
      mockUserRepository as any
    );
  });

  it('should return paginated patients', async () => {
    mockPatientRepository.findAll.mockResolvedValueOnce({
      items: [],
      total: 0,
    });
    const result = await useCase.execute({});
    expect(result).toEqual({ items: [], total: 0 });
  });

  it('should enrich with related users when requested', async () => {
    const items = [{ id: 'p1', createdBy: 'u1' }];
    mockPatientRepository.findAll.mockResolvedValueOnce({ items, total: 1 });
    mockUserRepository.findByIds.mockResolvedValueOnce([
      { id: 'u1', name: 'User', password: 'h' },
    ]);

    const result = await useCase.execute({
      includeRelatedUsers: true,
    } as any);

    expect(result.relatedUsers).toEqual([{ id: 'u1', name: 'User' }]);
  });
});
