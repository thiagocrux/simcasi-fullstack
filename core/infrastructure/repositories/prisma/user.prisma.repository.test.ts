jest.mock('../../lib/prisma', () => ({
  prisma: {
    user: {
      findFirst: jest.fn(),
      findMany: jest.fn(),
      count: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
  },
}));

import { userMock } from '@/tests/mocks/repositories/user.mock';
import { prisma } from '../../lib/prisma';
import { PrismaUserRepository } from './user.prisma.repository';

describe('PrismaUserRepository', () => {
  let repository: PrismaUserRepository;

  beforeEach(() => {
    jest.clearAllMocks();
    repository = new PrismaUserRepository();
  });

  it('should find a user by its unique ID', async () => {
    (prisma.user.findFirst as jest.Mock).mockResolvedValueOnce(userMock);
    const result = await repository.findById(userMock.id);
    expect(prisma.user.findFirst).toHaveBeenCalledWith(
      expect.objectContaining({
        where: expect.objectContaining({ id: userMock.id }),
      })
    );
    expect(result).toEqual(userMock);
  });

  it('should find users by multiple IDs', async () => {
    (prisma.user.findMany as jest.Mock).mockResolvedValueOnce([userMock]);
    const result = await repository.findByIds([userMock.id]);
    expect(prisma.user.findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: { id: { in: [userMock.id] } },
      })
    );
    expect(result).toEqual([userMock]);
  });

  it('should find a user by email', async () => {
    (prisma.user.findFirst as jest.Mock).mockResolvedValueOnce(userMock);
    const result = await repository.findByEmail(userMock.email);
    expect(prisma.user.findFirst).toHaveBeenCalledWith(
      expect.objectContaining({
        where: expect.objectContaining({
          email: userMock.email,
        }),
      })
    );
    expect(result).toEqual(userMock);
  });

  it('should retrieve all users with default params', async () => {
    (prisma.user.findMany as jest.Mock).mockResolvedValueOnce([userMock]);
    (prisma.user.count as jest.Mock).mockResolvedValueOnce(1);

    const result = await repository.findAll();

    expect(prisma.user.findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        skip: 0,
        take: 20,
      })
    );
    expect(result).toEqual({ items: [userMock], total: 1 });
  });

  it('should filter users by roleId', async () => {
    (prisma.user.findMany as jest.Mock).mockResolvedValueOnce([userMock]);
    (prisma.user.count as jest.Mock).mockResolvedValueOnce(1);

    await repository.findAll({ roleId: userMock.roleId });

    expect(prisma.user.findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: expect.objectContaining({
          roleId: userMock.roleId,
        }),
      })
    );
  });

  it('should filter users by search term', async () => {
    (prisma.user.findMany as jest.Mock).mockResolvedValueOnce([userMock]);
    (prisma.user.count as jest.Mock).mockResolvedValueOnce(1);

    await repository.findAll({ search: 'João' });

    expect(prisma.user.findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: expect.objectContaining({
          OR: expect.any(Array),
        }),
      })
    );
  });

  it('should create a new user', async () => {
    const { id, createdAt, updatedAt, deletedAt, password, ...data } = userMock;
    (prisma.user.create as jest.Mock).mockResolvedValueOnce(userMock);

    const result = await repository.create({
      ...data,
      password: password ?? '',
    });

    expect(prisma.user.create).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({
          email: data.email,
          name: data.name,
        }),
      })
    );
    expect(result).toEqual(userMock);
  });

  it('should update a user', async () => {
    const updated = { ...userMock, name: 'João Santos' };
    (prisma.user.update as jest.Mock).mockResolvedValueOnce(updated);

    const result = await repository.update(
      userMock.id,
      { name: 'João Santos' },
      'user-id'
    );

    expect(prisma.user.update).toHaveBeenCalledWith(
      expect.objectContaining({
        where: { id: userMock.id },
      })
    );
    expect(result).toEqual(updated);
  });

  it('should update user password', async () => {
    const updated = { ...userMock, password: 'newHashedPassword' };
    (prisma.user.update as jest.Mock).mockResolvedValueOnce(updated);

    const result = await repository.updatePassword(
      userMock.id,
      'newHashedPassword',
      'user-id'
    );

    expect(prisma.user.update).toHaveBeenCalledWith(
      expect.objectContaining({
        where: { id: userMock.id },
        data: expect.objectContaining({
          password: 'newHashedPassword',
        }),
      })
    );
    expect(result).toEqual(updated);
  });

  it('should soft delete a user', async () => {
    (prisma.user.update as jest.Mock).mockResolvedValueOnce(userMock);

    await repository.softDelete(userMock.id, 'user-id');

    expect(prisma.user.update).toHaveBeenCalledWith(
      expect.objectContaining({
        where: { id: userMock.id },
        data: expect.objectContaining({
          deletedAt: expect.any(Date),
        }),
      })
    );
  });

  it('should restore a soft deleted user', async () => {
    (prisma.user.update as jest.Mock).mockResolvedValueOnce(userMock);

    await repository.restore(userMock.id, 'user-id');

    expect(prisma.user.update).toHaveBeenCalledWith(
      expect.objectContaining({
        where: { id: userMock.id },
        data: expect.objectContaining({
          deletedAt: null,
        }),
      })
    );
  });
});
