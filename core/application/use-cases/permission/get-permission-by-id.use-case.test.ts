/* eslint-disable @typescript-eslint/no-explicit-any */
import { NotFoundError } from '@/core/domain/errors/app.error';
import { GetPermissionByIdUseCase } from './get-permission-by-id.use-case';

const mockPermissionRepository = { findById: jest.fn() };

describe('GetPermissionByIdUseCase', () => {
  let useCase: GetPermissionByIdUseCase;

  beforeEach(() => {
    jest.clearAllMocks();
    useCase = new GetPermissionByIdUseCase(mockPermissionRepository as any);
  });

  it('should return the permission when found', async () => {
    const perm = { id: 'perm-1', code: 'create:patient' };
    mockPermissionRepository.findById.mockResolvedValueOnce(perm);
    expect(await useCase.execute({ id: 'perm-1' })).toEqual(perm);
  });

  it('should throw NotFoundError when not found', async () => {
    mockPermissionRepository.findById.mockResolvedValueOnce(null);
    await expect(useCase.execute({ id: 'x' })).rejects.toThrow(NotFoundError);
  });
});
