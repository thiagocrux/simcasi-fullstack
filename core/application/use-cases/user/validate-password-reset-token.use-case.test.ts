/* eslint-disable @typescript-eslint/no-explicit-any */
import { ValidatePasswordResetTokenUseCase } from './validate-password-reset-token.use-case';

const mockTokenRepo = { findByToken: jest.fn() };
const mockUserRepository = { findById: jest.fn() };

describe('ValidatePasswordResetTokenUseCase', () => {
  let useCase: ValidatePasswordResetTokenUseCase;

  beforeEach(() => {
    jest.clearAllMocks();
    useCase = new ValidatePasswordResetTokenUseCase(
      mockTokenRepo as any,
      mockUserRepository as any
    );
  });

  it('should return valid with email for a valid token', async () => {
    mockTokenRepo.findByToken.mockResolvedValueOnce({
      id: 'tok-1',
      userId: 'u1',
    });
    mockUserRepository.findById.mockResolvedValueOnce({
      id: 'u1',
      email: 'a@b.com',
    });

    const result = await useCase.execute({ token: 'valid-tok' });

    expect(result).toEqual({ isValid: true, email: 'a@b.com' });
  });

  it('should return invalid when token not found', async () => {
    mockTokenRepo.findByToken.mockResolvedValueOnce(null);

    const result = await useCase.execute({ token: 'bad' });

    expect(result).toEqual({ isValid: false });
  });

  it('should return invalid when user not found', async () => {
    mockTokenRepo.findByToken.mockResolvedValueOnce({
      id: 'tok-1',
      userId: 'u1',
    });
    mockUserRepository.findById.mockResolvedValueOnce(null);

    const result = await useCase.execute({ token: 'tok' });

    expect(result).toEqual({ isValid: false });
  });
});
