/* eslint-disable @typescript-eslint/no-explicit-any */
import { LogoutUseCase } from './logout.use-case';

const mockSessionRepository = { softDelete: jest.fn() };

describe('LogoutUseCase', () => {
  let useCase: LogoutUseCase;

  beforeEach(() => {
    jest.clearAllMocks();
    useCase = new LogoutUseCase(mockSessionRepository as any);
  });

  it('should soft delete the session', async () => {
    await useCase.execute({ sessionId: 'sess-1' });
    expect(mockSessionRepository.softDelete).toHaveBeenCalledWith('sess-1');
  });
});
