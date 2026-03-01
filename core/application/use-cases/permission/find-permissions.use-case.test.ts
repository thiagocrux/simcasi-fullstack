/* eslint-disable @typescript-eslint/no-explicit-any */
jest.mock('@/core/application/validation/schemas/permission.schema', () => ({
  permissionQuerySchema: {
    parse: jest.fn((input: any) => ({ skip: 0, take: 10, ...input })),
  },
}));

import { FindPermissionsUseCase } from './find-permissions.use-case';

const mockPermissionRepository = { findAll: jest.fn() };
const mockUserRepository = { findByIds: jest.fn() };

describe('FindPermissionsUseCase', () => {
  let useCase: FindPermissionsUseCase;

  beforeEach(() => {
    jest.clearAllMocks();
    useCase = new FindPermissionsUseCase(
      mockPermissionRepository as any,
      mockUserRepository as any
    );
  });

  it('should return paginated permissions', async () => {
    mockPermissionRepository.findAll.mockResolvedValueOnce({
      items: [],
      total: 0,
    });
    const result = await useCase.execute({});
    expect(result).toEqual({ items: [], total: 0 });
  });

  it('should enrich with related users when requested', async () => {
    const items = [{ id: 'p1', createdBy: 'u1' }];
    mockPermissionRepository.findAll.mockResolvedValueOnce({ items, total: 1 });
    mockUserRepository.findByIds.mockResolvedValueOnce([
      { id: 'u1', name: 'User', password: 'h' },
    ]);

    const result = await useCase.execute({
      includeRelatedUsers: true,
    } as any);

    expect(result.relatedUsers).toEqual([{ id: 'u1', name: 'User' }]);
  });
});
