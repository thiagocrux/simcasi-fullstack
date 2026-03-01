import { Permission } from '@/core/domain/entities/permission.entity';

export const permissionMock: Permission = {
  id: 'perm1234-5678-90ab-cdef-1234567890ab',
  code: 'USER_CREATE',
  label: 'Create Users',
  createdBy: '12aa95d3-1024-47fd-8be1-1ff6c129c14d',
  createdAt: new Date('2026-02-01T10:00:00Z'),
  updatedBy: null,
  updatedAt: null,
  deletedAt: null,
};
