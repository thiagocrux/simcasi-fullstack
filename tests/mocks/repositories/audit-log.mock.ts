import { AuditLog } from '@/core/domain/entities/audit-log.entity';

export const auditLogMock: AuditLog = {
  id: '12aa95d3-1024-47fd-8be1-1ff6c129c14d',
  action: 'CREATE',
  userId: '12aa95d3-1024-47fd-8be1-1ff6c129c14d',
  entityName: 'USER',
  entityId: 'a1b2c3d4-e5f6-7a8b-9c0d-1e2f3a4b5c6d',
  oldValues: {},
  newValues: {
    id: 'ea8da58e-3527-4aef-8acd-617b6cdc114c',
    name: 'John Doe',
    email: 'john.doe@gmail.com',
    roleId: '96548d9d-0947-42fe-ac2a-1cf5fb5af8e5',
    isSystem: false,
    createdAt: '2026-02-25T19:51:34.332Z',
    createdBy: '12aa95d3-1024-47fd-8be1-1ff6c129c14d',
    deletedAt: null,
    updatedAt: '2026-02-25T19:51:34.332Z',
    updatedBy: null,
  },
  createdAt: new Date('2024-02-27T10:00:00Z'),
};
