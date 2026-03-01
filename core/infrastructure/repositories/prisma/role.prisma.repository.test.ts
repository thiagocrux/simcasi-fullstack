jest.mock('../../lib/prisma', () => ({
  prisma: {
    role: {
      findFirst: jest.fn(),
      findMany: jest.fn(),
      count: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
    rolePermission: {
      count: jest.fn(),
    },
  },
}));

import { roleMock } from '@/tests/mocks/repositories/role.mock';
import { prisma } from '../../lib/prisma';
import { PrismaRoleRepository } from './role.prisma.repository';

describe('PrismaRoleRepository', () => {
  let repository: PrismaRoleRepository;

  beforeEach(() => {
    jest.clearAllMocks();
    repository = new PrismaRoleRepository();
  });

  it('should find a role by its unique ID', async () => {
    (prisma.role.findFirst as jest.Mock).mockResolvedValueOnce(roleMock);
    const result = await repository.findById(roleMock.id);
    expect(prisma.role.findFirst).toHaveBeenCalledWith(
      expect.objectContaining({
        where: expect.objectContaining({ id: roleMock.id }),
      })
    );
    expect(result).toEqual(roleMock);
  });

  it('should find a role by code', async () => {
    (prisma.role.findFirst as jest.Mock).mockResolvedValueOnce(roleMock);
    const result = await repository.findByCode(roleMock.code);
    expect(prisma.role.findFirst).toHaveBeenCalledWith(
      expect.objectContaining({
        where: expect.objectContaining({
          code: roleMock.code,
        }),
      })
    );
    expect(result).toEqual(roleMock);
  });

  it('should retrieve all roles with default params', async () => {
    (prisma.role.findMany as jest.Mock).mockResolvedValueOnce([roleMock]);
    (prisma.role.count as jest.Mock).mockResolvedValueOnce(1);

    const result = await repository.findAll();

    expect(prisma.role.findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        skip: 0,
        take: 20,
      })
    );
    expect(result).toEqual({ items: [roleMock], total: 1 });
  });

  it('should filter roles by search term', async () => {
    (prisma.role.findMany as jest.Mock).mockResolvedValueOnce([roleMock]);
    (prisma.role.count as jest.Mock).mockResolvedValueOnce(1);

    await repository.findAll({ search: 'ADMIN' });

    expect(prisma.role.findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: expect.objectContaining({
          code: expect.objectContaining({ contains: 'ADMIN' }),
        }),
      })
    );
  });

  it('should create a new role', async () => {
    const { id, createdAt, updatedAt, deletedAt, ...data } = roleMock;
    (prisma.role.create as jest.Mock).mockResolvedValueOnce(roleMock);

    const result = await repository.create(data);

    expect(prisma.role.create).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({
          code: data.code,
          label: data.label,
        }),
      })
    );
    expect(result).toEqual(roleMock);
  });

  it('should update a role', async () => {
    const updated = { ...roleMock, label: 'Updated Label' };
    (prisma.role.update as jest.Mock).mockResolvedValueOnce(updated);

    const result = await repository.update(
      roleMock.id,
      { label: 'Updated Label' },
      'user-id'
    );

    expect(prisma.role.update).toHaveBeenCalledWith(
      expect.objectContaining({
        where: { id: roleMock.id },
      })
    );
    expect(result).toEqual(updated);
  });

  it('should soft delete a role', async () => {
    (prisma.role.update as jest.Mock).mockResolvedValueOnce(roleMock);

    await repository.softDelete(roleMock.id, 'user-id');

    expect(prisma.role.update).toHaveBeenCalledWith(
      expect.objectContaining({
        where: { id: roleMock.id },
        data: expect.objectContaining({
          deletedAt: expect.any(Date),
        }),
      })
    );
  });

  it('should restore a soft deleted role', async () => {
    (prisma.role.update as jest.Mock).mockResolvedValueOnce(roleMock);

    await repository.restore(roleMock.id, 'user-id');

    expect(prisma.role.update).toHaveBeenCalledWith(
      expect.objectContaining({
        where: { id: roleMock.id },
        data: expect.objectContaining({
          deletedAt: null,
        }),
      })
    );
  });

  it('should check if role has specific permissions', async () => {
    (prisma.rolePermission.count as jest.Mock).mockResolvedValueOnce(2);

    const result = await repository.hasPermissions(roleMock.id, [
      'USER_READ',
      'USER_CREATE',
    ]);

    expect(prisma.rolePermission.count).toHaveBeenCalledWith(
      expect.objectContaining({
        where: expect.objectContaining({
          roleId: roleMock.id,
        }),
      })
    );
    expect(result).toBe(true);
  });

  it('should return false when role has none of the permissions', async () => {
    (prisma.rolePermission.count as jest.Mock).mockResolvedValueOnce(0);

    const result = await repository.hasPermissions(roleMock.id, [
      'USER_READ',
      'USER_CREATE',
    ]);

    expect(result).toBe(false);
  });
});
