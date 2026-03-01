/* eslint-disable @typescript-eslint/no-explicit-any */
jest.mock('@/core/infrastructure/lib/request-context', () => ({
  getRequestContext: jest.fn(() => ({
    userId: 'ctx-user-id',
    ipAddress: '127.0.0.1',
    userAgent: 'Jest',
  })),
}));

jest.mock('@/core/application/validation/schemas/role.schema', () => ({
  roleSchema: {
    partial: jest.fn(() => ({
      safeParse: jest.fn((data: any) => ({ success: true, data })),
    })),
  },
}));

jest.mock('@/core/application/validation/zod.utils', () => ({
  formatZodError: jest.fn(() => ({})),
}));

import { ConflictError, NotFoundError } from '@/core/domain/errors/app.error';
import { UpdateRoleUseCase } from './update-role.use-case';

const mockRoleRepository = {
  findById: jest.fn(),
  findByCode: jest.fn(),
  update: jest.fn(),
};
const mockPermissionRepository = { findByIds: jest.fn() };
const mockAuditLogRepository = { create: jest.fn() };

describe('UpdateRoleUseCase', () => {
  let useCase: UpdateRoleUseCase;

  beforeEach(() => {
    jest.clearAllMocks();
    useCase = new UpdateRoleUseCase(
      mockRoleRepository as any,
      mockPermissionRepository as any,
      mockAuditLogRepository as any
    );
  });

  it('should update and create audit log', async () => {
    const {
      roleSchema,
    } = require('@/core/application/validation/schemas/role.schema');
    roleSchema.partial.mockReturnValueOnce({
      safeParse: jest.fn(() => ({
        success: true,
        data: { label: 'Updated' },
      })),
    });
    mockRoleRepository.findById.mockResolvedValueOnce({ id: 'role-1' });
    mockRoleRepository.update.mockResolvedValueOnce({
      id: 'role-1',
      label: 'Updated',
    });

    const result = await useCase.execute({
      id: 'role-1',
      label: 'Updated',
    } as any);

    expect(mockRoleRepository.update).toHaveBeenCalled();
    expect(mockAuditLogRepository.create).toHaveBeenCalled();
    expect(result).toEqual({ id: 'role-1', label: 'Updated' });
  });

  it('should throw ConflictError when changing to existing code', async () => {
    const {
      roleSchema,
    } = require('@/core/application/validation/schemas/role.schema');
    roleSchema.partial.mockReturnValueOnce({
      safeParse: jest.fn(() => ({
        success: true,
        data: { code: 'EXISTING' },
      })),
    });
    mockRoleRepository.findById.mockResolvedValueOnce({ id: 'role-1' });
    mockRoleRepository.findByCode.mockResolvedValueOnce({ id: 'role-other' });

    await expect(
      useCase.execute({ id: 'role-1', code: 'EXISTING' } as any)
    ).rejects.toThrow(ConflictError);
  });

  it('should throw NotFoundError when role does not exist', async () => {
    const {
      roleSchema,
    } = require('@/core/application/validation/schemas/role.schema');
    roleSchema.partial.mockReturnValueOnce({
      safeParse: jest.fn(() => ({ success: true, data: {} })),
    });
    mockRoleRepository.findById.mockResolvedValueOnce(null);

    await expect(useCase.execute({ id: 'x' } as any)).rejects.toThrow(
      NotFoundError
    );
  });

  it('should throw NotFoundError when permissionIds not found', async () => {
    const {
      roleSchema,
    } = require('@/core/application/validation/schemas/role.schema');
    roleSchema.partial.mockReturnValueOnce({
      safeParse: jest.fn(() => ({
        success: true,
        data: { permissionIds: ['p1', 'p2'] },
      })),
    });
    mockPermissionRepository.findByIds.mockResolvedValueOnce([{ id: 'p1' }]);

    await expect(
      useCase.execute({ id: 'role-1', permissionIds: ['p1', 'p2'] } as any)
    ).rejects.toThrow(NotFoundError);
  });
});
