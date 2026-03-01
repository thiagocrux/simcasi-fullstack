import { Session } from '@/core/domain/entities/session.entity';

export const sessionMock: Session = {
  id: 'sess1234-5678-90ab-cdef-1234567890ab',
  userId: '12aa95d3-1024-47fd-8be1-1ff6c129c14d',
  issuedAt: new Date('2026-02-27T10:00:00Z'),
  expiresAt: new Date('2026-02-28T10:00:00Z'),
  ipAddress: '192.168.1.1',
  userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
  createdAt: new Date('2026-02-27T10:00:00Z'),
  updatedAt: null,
  deletedAt: null,
};
