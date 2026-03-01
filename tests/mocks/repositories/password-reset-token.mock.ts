import { PasswordResetToken } from '@/core/domain/entities/password-reset-token.entity';

export const passwordResetTokenMock: PasswordResetToken = {
  id: 'prt1b2c3-d4e5-f6a7-b8c9-d0e1f2a3b4c5',
  userId: '12aa95d3-1024-47fd-8be1-1ff6c129c14d',
  token: 'abc123def456ghi789jkl012mno345pqr678stu901vwx234yz',
  expiresAt: new Date('2026-02-28T12:00:00Z'),
  usedAt: null,
  createdAt: new Date('2026-02-27T10:00:00Z'),
  updatedAt: null,
  deletedAt: null,
};
