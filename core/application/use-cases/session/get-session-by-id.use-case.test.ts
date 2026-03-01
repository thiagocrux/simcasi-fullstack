/* eslint-disable @typescript-eslint/no-explicit-any */
import { NotFoundError } from '@/core/domain/errors/app.error';
import { GetSessionByIdUseCase } from './get-session-by-id.use-case';

const mockSessionRepository = { findById: jest.fn() };

describe('GetSessionByIdUseCase', () => {
  let useCase: GetSessionByIdUseCase;

  beforeEach(() => {
    jest.clearAllMocks();
    useCase = new GetSessionByIdUseCase(mockSessionRepository as any);
  });

  it('should return the session when found', async () => {
    const session = { id: 'sess-1', userId: 'u1' };
    mockSessionRepository.findById.mockResolvedValueOnce(session);
    expect(await useCase.execute({ id: 'sess-1' })).toEqual(session);
  });

  it('should pass includeDeleted flag', async () => {
    mockSessionRepository.findById.mockResolvedValueOnce({ id: 'sess-1' });
    await useCase.execute({ id: 'sess-1', includeDeleted: true });
    expect(mockSessionRepository.findById).toHaveBeenCalledWith('sess-1', true);
  });

  it('should throw NotFoundError when not found', async () => {
    mockSessionRepository.findById.mockResolvedValueOnce(null);
    await expect(useCase.execute({ id: 'x' })).rejects.toThrow(NotFoundError);
  });
});
