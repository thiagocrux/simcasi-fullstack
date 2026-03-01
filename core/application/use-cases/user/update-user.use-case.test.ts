/* eslint-disable @typescript-eslint/no-explicit-any */
jest.mock('@/core/infrastructure/lib/request-context', () => ({
  getRequestContext: jest.fn(() => ({
    userId: 'ctx-user-id',
    ipAddress: '127.0.0.1',
    userAgent: 'Jest',
  })),
  isUserAdmin: jest.fn(() => true),
}));

jest.mock('@/core/application/validation/schemas/user.schema', () => ({
  userSchema: {
    partial: jest.fn(() => ({
      safeParse: jest.fn((data: any) => ({ success: true, data })),
    })),
  },
}));

jest.mock('@/core/application/validation/zod.utils', () => ({
  formatZodError: jest.fn(() => ({})),
}));

jest.mock('@/core/domain/utils/user.utils', () => ({
  isImmutableEmail: jest.fn(() => false),
}));

jest.mock('@/core/infrastructure/lib/env.config', () => ({
  env: { NEXT_PUBLIC_DEFAULT_USER_EMAIL: 'system@test.com' },
}));

import {
  ConflictError,
  ForbiddenError,
  NotFoundError,
} from '@/core/domain/errors/app.error';
import { UpdateUserUseCase } from './update-user.use-case';

const mockUserRepository = {
  findById: jest.fn(),
  findByEmail: jest.fn(),
  update: jest.fn(),
};
const mockRoleRepository = { findById: jest.fn() };
const mockHashProvider = { hash: jest.fn() };
const mockAuditLogRepository = { create: jest.fn() };

describe('UpdateUserUseCase', () => {
  let useCase: UpdateUserUseCase;

  beforeEach(() => {
    jest.clearAllMocks();
    useCase = new UpdateUserUseCase(
      mockUserRepository as any,
      mockRoleRepository as any,
      mockHashProvider as any,
      mockAuditLogRepository as any
    );
  });

  it('should update user and create audit log', async () => {
    const {
      userSchema,
    } = require('@/core/application/validation/schemas/user.schema');
    userSchema.partial.mockReturnValueOnce({
      safeParse: jest.fn(() => ({ success: true, data: { name: 'New' } })),
    });
    mockUserRepository.findById.mockResolvedValueOnce({
      id: 'u1',
      password: 'h',
      roleId: 'r1',
    });
    mockUserRepository.update.mockResolvedValueOnce({
      id: 'u1',
      name: 'New',
      password: 'h',
    });

    const result = await useCase.execute({ id: 'u1', name: 'New' } as any);

    expect(result).not.toHaveProperty('password');
    expect(mockAuditLogRepository.create).toHaveBeenCalled();
  });

  it('should hash password if provided', async () => {
    const {
      userSchema,
    } = require('@/core/application/validation/schemas/user.schema');
    userSchema.partial.mockReturnValueOnce({
      safeParse: jest.fn(() => ({
        success: true,
        data: { password: 'new-pass' },
      })),
    });
    mockUserRepository.findById.mockResolvedValueOnce({
      id: 'u1',
      password: 'h',
    });
    mockHashProvider.hash.mockResolvedValueOnce('hashed-new');
    mockUserRepository.update.mockResolvedValueOnce({
      id: 'u1',
      password: 'hashed-new',
    });

    await useCase.execute({ id: 'u1', password: 'new-pass' } as any);

    expect(mockHashProvider.hash).toHaveBeenCalledWith('new-pass');
  });

  it('should throw ForbiddenError when non-admin edits other user', async () => {
    const {
      isUserAdmin,
    } = require('@/core/infrastructure/lib/request-context');
    isUserAdmin.mockReturnValueOnce(false);

    const {
      userSchema,
    } = require('@/core/application/validation/schemas/user.schema');
    userSchema.partial.mockReturnValueOnce({
      safeParse: jest.fn(() => ({ success: true, data: {} })),
    });
    mockUserRepository.findById.mockResolvedValueOnce({ id: 'other-id' });

    await expect(useCase.execute({ id: 'other-id' } as any)).rejects.toThrow(
      ForbiddenError
    );
  });

  it('should throw ConflictError when email already exists', async () => {
    const {
      userSchema,
    } = require('@/core/application/validation/schemas/user.schema');
    userSchema.partial.mockReturnValueOnce({
      safeParse: jest.fn(() => ({
        success: true,
        data: { email: 'taken@test.com' },
      })),
    });
    mockUserRepository.findById.mockResolvedValueOnce({
      id: 'u1',
      email: 'old@test.com',
      isSystem: false,
    });
    mockUserRepository.findByEmail.mockResolvedValueOnce({ id: 'u2' });

    await expect(
      useCase.execute({ id: 'u1', email: 'taken@test.com' } as any)
    ).rejects.toThrow(ConflictError);
  });

  it('should throw ForbiddenError when changing protected email', async () => {
    const { isImmutableEmail } = require('@/core/domain/utils/user.utils');
    isImmutableEmail.mockReturnValueOnce(true);

    const {
      userSchema,
    } = require('@/core/application/validation/schemas/user.schema');
    userSchema.partial.mockReturnValueOnce({
      safeParse: jest.fn(() => ({
        success: true,
        data: { email: 'new@test.com' },
      })),
    });
    mockUserRepository.findById.mockResolvedValueOnce({
      id: 'u1',
      email: 'sys@test.com',
      isSystem: false,
    });

    await expect(
      useCase.execute({ id: 'u1', email: 'new@test.com' } as any)
    ).rejects.toThrow(ForbiddenError);
  });

  it('should throw NotFoundError when user not found', async () => {
    const {
      userSchema,
    } = require('@/core/application/validation/schemas/user.schema');
    userSchema.partial.mockReturnValueOnce({
      safeParse: jest.fn(() => ({ success: true, data: {} })),
    });
    mockUserRepository.findById.mockResolvedValueOnce(null);

    await expect(useCase.execute({ id: 'x' } as any)).rejects.toThrow(
      NotFoundError
    );
  });
});
