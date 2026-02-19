import { PasswordResetToken } from '@/core/domain/entities/password-reset-token.entity';
import { PasswordResetTokenRepository } from '@/core/domain/repositories/password-reset-token.repository';
import { prisma } from '../../lib/prisma';

export class PrismaPasswordResetTokenRepository implements PasswordResetTokenRepository {
  /**
   * Creates a new password reset token.
   * @param data Token data to persist.
   * @returns The created token record.
   */
  async create(
    data: Omit<
      PasswordResetToken,
      'id' | 'createdAt' | 'updatedAt' | 'deletedAt'
    >
  ): Promise<PasswordResetToken> {
    const tokenRecord = await prisma.passwordResetToken.create({
      data: {
        userId: data.userId,
        token: data.token,
        expiresAt: data.expiresAt,
        usedAt: data.usedAt || null,
      },
    });

    return tokenRecord as unknown as PasswordResetToken;
  }

  /**
   * Finds a valid token based on the provided token string.
   * Returns null if not found or already used/deleted/expired.
   * @param token The unique token string.
   * @returns The token details or null if invalid.
   */
  async findByToken(token: string): Promise<PasswordResetToken | null> {
    const tokenRecord = await prisma.passwordResetToken.findFirst({
      where: {
        token,
        usedAt: null,
        deletedAt: null,
        expiresAt: {
          gt: new Date(),
        },
      },
    });

    return (tokenRecord as unknown as PasswordResetToken) || null;
  }

  /**
   * Invalidates a token by marking it as used.
   * @param id Unique identifier of the token record.
   * @returns The updated token record.
   */
  async markAsUsed(id: string): Promise<PasswordResetToken> {
    const tokenRecord = await prisma.passwordResetToken.update({
      where: { id },
      data: { usedAt: new Date() },
    });

    return tokenRecord as unknown as PasswordResetToken;
  }

  /**
   * Deletes (soft or hard) all previous valid tokens for a given user.
   * Often used before creating a new token to enforce only one active token per user.
   * @param userId The unique user identifier.
   */
  async invalidateAllForUser(userId: string): Promise<void> {
    await prisma.passwordResetToken.updateMany({
      where: {
        userId,
        usedAt: null,
        deletedAt: null,
      },
      data: {
        deletedAt: new Date(),
      },
    });
  }
}
