/* eslint-disable @typescript-eslint/no-explicit-any */
import { NotFoundError } from '@/core/domain/errors/app.error';
import { GetUserByIdUseCase } from './get-user-by-id.use-case';

const mockUserRepository = {
  findById: jest.fn(),
} as jest.Mocked<{
  findById: jest.Mock;
}>;

describe('GetUserByIdUseCase', () => {
  let useCase: GetUserByIdUseCase;

  beforeEach(() => {
    jest.clearAllMocks();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    useCase = new GetUserByIdUseCase(mockUserRepository as any);
  });

  it('should return user without password', async () => {
    const user = { id: 'u1', name: 'User', password: 'hashed' };
    mockUserRepository.findById.mockResolvedValueOnce(user);
    const result = await useCase.execute({ id: 'u1' });
    expect(result.id).toBe('u1');
  });

  it('should pass includeDeleted flag', async () => {
    mockUserRepository.findById.mockResolvedValueOnce({
      id: 'u1',
      password: 'h',
    });
    await useCase.execute({ id: 'u1', includeDeleted: true });
    expect(mockUserRepository.findById).toHaveBeenCalledWith('u1', true);
  });

  it('should throw NotFoundError when not found', async () => {
    mockUserRepository.findById.mockResolvedValueOnce(null);
    await expect(useCase.execute({ id: 'x' })).rejects.toThrow(NotFoundError);
  });
});
