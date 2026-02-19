import { PasswordResetToken } from '../entities/password-reset-token.entity';

/**
 * Defines the contract for persistence operations related to password reset tokens.
 */
export interface PasswordResetTokenRepository {
  /**
   * Creates a new password reset token.
   * @param data Token data to persist.
   * @returns The created token record.
   */
  create(
    data: Omit<
      PasswordResetToken,
      'id' | 'createdAt' | 'updatedAt' | 'deletedAt'
    >
  ): Promise<PasswordResetToken>;

  /**
   * Finds a valid token based on the provided token string.
   * Returns null if not found or already used/deleted/expired.
   * @param token The unique token string.
   * @returns The token details or null if invalid.
   */
  findByToken(token: string): Promise<PasswordResetToken | null>;

  /**
   * Invalidates a token by marking it as used.
   * @param id Unique identifier of the token record.
   * @returns The updated token record.
   */
  markAsUsed(id: string): Promise<PasswordResetToken>;

  /**
   * Deletes (soft or hard) all previous valid tokens for a given user.
   * Often used before creating a new token to enforce only one active token per user.
   * @param userId The unique user identifier.
   */
  invalidateAllForUser(userId: string): Promise<void>;
}
