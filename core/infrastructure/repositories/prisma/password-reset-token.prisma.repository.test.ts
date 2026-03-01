jest.mock('../../lib/prisma', () => ({
  prisma: {
    passwordResetToken: {
      findFirst: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      updateMany: jest.fn(),
    },
  },
}));

import { passwordResetTokenMock } from '@/tests/mocks/repositories/password-reset-token.mock';
import { prisma } from '../../lib/prisma';
import { PrismaPasswordResetTokenRepository } from './password-reset-token.prisma.repository';

describe('PrismaPasswordResetTokenRepository', () => {
  let repository: PrismaPasswordResetTokenRepository;

  beforeEach(() => {
    jest.clearAllMocks();
    repository = new PrismaPasswordResetTokenRepository();
  });

  it('should create a new password reset token', async () => {
    const { id, createdAt, updatedAt, deletedAt, ...data } =
      passwordResetTokenMock;
    (prisma.passwordResetToken.create as jest.Mock).mockResolvedValueOnce(
      passwordResetTokenMock
    );

    const result = await repository.create(data);

    expect(prisma.passwordResetToken.create).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({
          userId: data.userId,
          token: data.token,
        }),
      })
    );
    expect(result).toEqual(passwordResetTokenMock);
  });

  it('should find a valid token by its value', async () => {
    (prisma.passwordResetToken.findFirst as jest.Mock).mockResolvedValueOnce(
      passwordResetTokenMock
    );

    const result = await repository.findByToken(passwordResetTokenMock.token);

    expect(prisma.passwordResetToken.findFirst).toHaveBeenCalledWith(
      expect.objectContaining({
        where: expect.objectContaining({
          token: passwordResetTokenMock.token,
          usedAt: null,
        }),
      })
    );
    expect(result).toEqual(passwordResetTokenMock);
  });

  it('should mark a token as used', async () => {
    const usedToken = { ...passwordResetTokenMock, usedAt: new Date() };
    (prisma.passwordResetToken.update as jest.Mock).mockResolvedValueOnce(
      usedToken
    );

    const result = await repository.markAsUsed(passwordResetTokenMock.id);

    expect(prisma.passwordResetToken.update).toHaveBeenCalledWith(
      expect.objectContaining({
        where: { id: passwordResetTokenMock.id },
        data: expect.objectContaining({
          usedAt: expect.any(Date),
        }),
      })
    );
    expect(result).toEqual(usedToken);
  });

  it('should invalidate all tokens for a user', async () => {
    (prisma.passwordResetToken.updateMany as jest.Mock).mockResolvedValueOnce({
      count: 2,
    });

    await repository.invalidateAllForUser(passwordResetTokenMock.userId);

    expect(prisma.passwordResetToken.updateMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: expect.objectContaining({
          userId: passwordResetTokenMock.userId,
          usedAt: null,
        }),
      })
    );
  });
});
