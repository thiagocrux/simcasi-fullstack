import { User } from '@/core/domain/entities/user.entity';

export const userMock: User = {
  id: '12aa95d3-1024-47fd-8be1-1ff6c129c14d',
  name: 'John Doe',
  email: 'john.doe@example.com',
  password: '$2b$10$abcdefghijklmnopqrstuvwxyz123456',
  roleId: 'role1234-5678-90ab-cdef-1234567890ab',
  isSystem: false,
  createdBy: null,
  createdAt: new Date('2026-02-01T10:00:00Z'),
  updatedBy: null,
  updatedAt: null,
  deletedAt: null,
};
