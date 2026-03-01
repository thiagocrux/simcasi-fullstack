/* eslint-disable @typescript-eslint/no-explicit-any */
import { NotFoundError } from '@/core/domain/errors/app.error';
import { GetRoleByIdUseCase } from './get-role-by-id.use-case';

const mockRoleRepository = { findById: jest.fn() };

describe('GetRoleByIdUseCase', () => {
  let useCase: GetRoleByIdUseCase;

  beforeEach(() => {
    jest.clearAllMocks();
    useCase = new GetRoleByIdUseCase(mockRoleRepository as any);
  });

  it('should return the role when found', async () => {
    const role = { id: 'role-1', code: 'ADMIN' };
    mockRoleRepository.findById.mockResolvedValueOnce(role);
    expect(await useCase.execute({ id: 'role-1' })).toEqual(role);
  });

  it('should throw NotFoundError when not found', async () => {
    mockRoleRepository.findById.mockResolvedValueOnce(null);
    await expect(useCase.execute({ id: 'x' })).rejects.toThrow(NotFoundError);
  });
});
