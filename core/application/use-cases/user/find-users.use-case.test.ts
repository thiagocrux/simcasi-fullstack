/* eslint-disable @typescript-eslint/no-explicit-any */
jest.mock('@/core/application/validation/schemas/user.schema', () => ({
  userQuerySchema: {
    parse: jest.fn((input: any) => ({ skip: 0, take: 10, ...input })),
  },
}));

import { FindUsersUseCase } from './find-users.use-case';

const mockUserRepository = { findAll: jest.fn(), findByIds: jest.fn() };

describe('FindUsersUseCase', () => {
  let useCase: FindUsersUseCase;

  beforeEach(() => {
    jest.clearAllMocks();
    useCase = new FindUsersUseCase(mockUserRepository as any);
  });

  it('should return paginated users without passwords', async () => {
    mockUserRepository.findAll.mockResolvedValueOnce({
      items: [{ id: 'u1', name: 'User', password: 'hashed' }],
      total: 1,
    });

    const result = await useCase.execute({});

    expect(result.items[0]).not.toHaveProperty('password');
    expect(result.total).toBe(1);
  });

  it('should enrich with related users when requested', async () => {
    mockUserRepository.findAll.mockResolvedValueOnce({
      items: [{ id: 'u1', name: 'A', password: 'h', createdBy: 'u2' }],
      total: 1,
    });
    mockUserRepository.findByIds.mockResolvedValueOnce([
      { id: 'u2', name: 'B', password: 'h' },
    ]);

    const result = await useCase.execute({ includeRelatedUsers: true } as any);

    expect(result.relatedUsers).toEqual([{ id: 'u2', name: 'B' }]);
  });
});
