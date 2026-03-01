/* eslint-disable @typescript-eslint/no-explicit-any */
jest.mock('@/core/application/validation/schemas/role.schema', () => ({
  roleQuerySchema: {
    parse: jest.fn((input: any) => ({ skip: 0, take: 10, ...input })),
  },
}));

import { FindRolesUseCase } from './find-roles.use-case';

const mockRoleRepository = { findAll: jest.fn() };
const mockUserRepository = { findByIds: jest.fn() };

describe('FindRolesUseCase', () => {
  let useCase: FindRolesUseCase;

  beforeEach(() => {
    jest.clearAllMocks();
    useCase = new FindRolesUseCase(
      mockRoleRepository as any,
      mockUserRepository as any
    );
  });

  it('should return paginated roles', async () => {
    mockRoleRepository.findAll.mockResolvedValueOnce({ items: [], total: 0 });
    const result = await useCase.execute({});
    expect(result).toEqual({ items: [], total: 0 });
  });

  it('should enrich with related users when requested', async () => {
    const items = [{ id: 'r1', createdBy: 'u1' }];
    mockRoleRepository.findAll.mockResolvedValueOnce({ items, total: 1 });
    mockUserRepository.findByIds.mockResolvedValueOnce([
      { id: 'u1', name: 'User', password: 'h' },
    ]);

    const result = await useCase.execute({ includeRelatedUsers: true } as any);

    expect(result.relatedUsers).toEqual([{ id: 'u1', name: 'User' }]);
  });
});
