/* eslint-disable @typescript-eslint/no-explicit-any */
jest.mock('@/core/application/validation/schemas/observation.schema', () => ({
  observationQuerySchema: {
    parse: jest.fn((input: any) => ({ skip: 0, take: 10, ...input })),
  },
}));

import { FindObservationsUseCase } from './find-observations.use-case';

const mockObservationRepository = { findAll: jest.fn() };
const mockUserRepository = { findByIds: jest.fn() };
const mockPatientRepository = { findByIds: jest.fn() };

describe('FindObservationsUseCase', () => {
  let useCase: FindObservationsUseCase;

  beforeEach(() => {
    jest.clearAllMocks();
    useCase = new FindObservationsUseCase(
      mockObservationRepository as any,
      mockUserRepository as any,
      mockPatientRepository as any
    );
  });

  it('should return paginated observations', async () => {
    mockObservationRepository.findAll.mockResolvedValueOnce({
      items: [],
      total: 0,
    });
    const result = await useCase.execute({});
    expect(result).toEqual({ items: [], total: 0 });
  });

  it('should enrich with related data when requested', async () => {
    const items = [{ id: 'o1', createdBy: 'u1', patientId: 'p1' }];
    mockObservationRepository.findAll.mockResolvedValueOnce({
      items,
      total: 1,
    });
    mockUserRepository.findByIds.mockResolvedValueOnce([
      { id: 'u1', name: 'User', password: 'h' },
    ]);
    mockPatientRepository.findByIds.mockResolvedValueOnce([
      { id: 'p1', name: 'Patient' },
    ]);

    const result = await useCase.execute({
      includeRelatedUsers: true,
      includeRelatedPatients: true,
    } as any);

    expect(result.relatedUsers).toEqual([{ id: 'u1', name: 'User' }]);
  });
});
