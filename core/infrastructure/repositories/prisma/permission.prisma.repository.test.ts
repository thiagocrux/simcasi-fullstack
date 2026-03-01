jest.mock('../../lib/prisma', () => ({
  prisma: {
    permission: {
      findFirst: jest.fn(),
      findMany: jest.fn(),
      count: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
  },
}));

import { permissionMock } from '@/tests/mocks/repositories/permission.mock';
import { prisma } from '../../lib/prisma';
import { PrismaPermissionRepository } from './permission.prisma.repository';

describe('PrismaPermissionRepository', () => {
  let repository: PrismaPermissionRepository;

  beforeEach(() => {
    jest.clearAllMocks();
    repository = new PrismaPermissionRepository();
  });

  it('should find a permission by its unique ID', async () => {
    (prisma.permission.findFirst as jest.Mock).mockResolvedValueOnce(
      permissionMock
    );
    const result = await repository.findById(permissionMock.id);
    expect(prisma.permission.findFirst).toHaveBeenCalledWith(
      expect.objectContaining({
        where: expect.objectContaining({ id: permissionMock.id }),
      })
    );
    expect(result).toEqual(permissionMock);
  });

  it('should find permissions by multiple IDs', async () => {
    (prisma.permission.findMany as jest.Mock).mockResolvedValueOnce([
      permissionMock,
    ]);
    const result = await repository.findByIds([permissionMock.id]);
    expect(prisma.permission.findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: expect.objectContaining({ id: { in: [permissionMock.id] } }),
      })
    );
    expect(result).toEqual([permissionMock]);
  });

  it('should find a permission by code', async () => {
    (prisma.permission.findFirst as jest.Mock).mockResolvedValueOnce(
      permissionMock
    );
    const result = await repository.findByCode(permissionMock.code);
    expect(prisma.permission.findFirst).toHaveBeenCalledWith(
      expect.objectContaining({
        where: expect.objectContaining({
          code: permissionMock.code,
        }),
      })
    );
    expect(result).toEqual(permissionMock);
  });

  it('should find permissions by roleId', async () => {
    (prisma.permission.findMany as jest.Mock).mockResolvedValueOnce([
      permissionMock,
    ]);
    const result = await repository.findByRoleId('role-id');
    expect(prisma.permission.findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: expect.objectContaining({
          roles: expect.any(Object),
        }),
      })
    );
    expect(result).toEqual([permissionMock]);
  });

  it('should retrieve all permissions with default params', async () => {
    (prisma.permission.findMany as jest.Mock).mockResolvedValueOnce([
      permissionMock,
    ]);
    (prisma.permission.count as jest.Mock).mockResolvedValueOnce(1);

    const result = await repository.findAll();

    expect(prisma.permission.findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        skip: 0,
        take: 20,
      })
    );
    expect(result).toEqual({ items: [permissionMock], total: 1 });
  });

  it('should filter permissions by search term', async () => {
    (prisma.permission.findMany as jest.Mock).mockResolvedValueOnce([
      permissionMock,
    ]);
    (prisma.permission.count as jest.Mock).mockResolvedValueOnce(1);

    await repository.findAll({ search: 'USER' });

    expect(prisma.permission.findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: expect.objectContaining({
          code: expect.objectContaining({ contains: 'USER' }),
        }),
      })
    );
  });

  it('should create a new permission', async () => {
    const { id, createdAt, updatedAt, deletedAt, ...data } = permissionMock;
    (prisma.permission.create as jest.Mock).mockResolvedValueOnce(
      permissionMock
    );

    const result = await repository.create(data);

    expect(prisma.permission.create).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({
          code: data.code,
          label: data.label,
        }),
      })
    );
    expect(result).toEqual(permissionMock);
  });

  it('should update a permission', async () => {
    const updated = { ...permissionMock, label: 'Updated Label' };
    (prisma.permission.update as jest.Mock).mockResolvedValueOnce(updated);

    const result = await repository.update(
      permissionMock.id,
      { label: 'Updated Label' },
      'user-id'
    );

    expect(prisma.permission.update).toHaveBeenCalledWith(
      expect.objectContaining({
        where: { id: permissionMock.id },
      })
    );
    expect(result).toEqual(updated);
  });

  it('should soft delete a permission', async () => {
    (prisma.permission.update as jest.Mock).mockResolvedValueOnce(
      permissionMock
    );

    await repository.softDelete(permissionMock.id, 'user-id');

    expect(prisma.permission.update).toHaveBeenCalledWith(
      expect.objectContaining({
        where: { id: permissionMock.id },
        data: expect.objectContaining({
          deletedAt: expect.any(Date),
        }),
      })
    );
  });

  it('should restore a soft deleted permission', async () => {
    (prisma.permission.update as jest.Mock).mockResolvedValueOnce(
      permissionMock
    );

    await repository.restore(permissionMock.id, 'user-id');

    expect(prisma.permission.update).toHaveBeenCalledWith(
      expect.objectContaining({
        where: { id: permissionMock.id },
        data: expect.objectContaining({
          deletedAt: null,
        }),
      })
    );
  });
});
