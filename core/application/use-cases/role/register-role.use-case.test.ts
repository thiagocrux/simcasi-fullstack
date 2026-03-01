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
    safeParse: jest.fn((data: any) => ({ success: true, data })),
    partial: jest.fn(() => ({
      safeParse: jest.fn((data: any) => ({ success: true, data })),
    })),
  },
}));

jest.mock('@/core/application/validation/zod.utils', () => ({
  formatZodError: jest.fn(() => ({})),
}));

import {
  ConflictError,
  NotFoundError,
  ValidationError,
} from '@/core/domain/errors/app.error';
import { RegisterRoleUseCase } from './register-role.use-case';

const mockRoleRepository = {
  findByCode: jest.fn(),
  create: jest.fn(),
  update: jest.fn(),
};
const mockPermissionRepository = { findByIds: jest.fn() };
const mockAuditLogRepository = { create: jest.fn() };

describe('RegisterRoleUseCase', () => {
  let useCase: RegisterRoleUseCase;

  const validInput = {
    code: 'ADMIN',
    label: 'Administrator',
    permissionIds: ['perm-1'],
  };

  beforeEach(() => {
    jest.clearAllMocks();
    useCase = new RegisterRoleUseCase(
      mockRoleRepository as any,
      mockPermissionRepository as any,
      mockAuditLogRepository as any
    );
  });

  it('should create a new role', async () => {
    const {
      roleSchema,
    } = require('@/core/application/validation/schemas/role.schema');
    roleSchema.safeParse.mockReturnValueOnce({
      success: true,
      data: validInput,
    });
    mockPermissionRepository.findByIds.mockResolvedValueOnce([
      { id: 'perm-1' },
    ]);
    mockRoleRepository.findByCode.mockResolvedValueOnce(null);
    const created = { id: 'role-1', ...validInput };
    mockRoleRepository.create.mockResolvedValueOnce(created);

    const result = await useCase.execute(validInput);

    expect(mockRoleRepository.create).toHaveBeenCalled();
    expect(mockAuditLogRepository.create).toHaveBeenCalledWith(
      expect.objectContaining({ action: 'CREATE', entityName: 'ROLE' })
    );
    expect(result).toEqual(created);
  });

  it('should restore a soft-deleted role with same code', async () => {
    const {
      roleSchema,
    } = require('@/core/application/validation/schemas/role.schema');
    roleSchema.safeParse.mockReturnValueOnce({
      success: true,
      data: validInput,
    });
    mockPermissionRepository.findByIds.mockResolvedValueOnce([
      { id: 'perm-1' },
    ]);
    mockRoleRepository.findByCode.mockResolvedValueOnce({
      id: 'role-old',
      deletedAt: new Date(),
    });
    const restored = { id: 'role-old', ...validInput, deletedAt: null };
    mockRoleRepository.update.mockResolvedValueOnce(restored);

    const result = await useCase.execute(validInput);

    expect(mockRoleRepository.update).toHaveBeenCalledWith(
      'role-old',
      expect.objectContaining({ deletedAt: null }),
      'ctx-user-id'
    );
    expect(mockAuditLogRepository.create).toHaveBeenCalledWith(
      expect.objectContaining({ action: 'RESTORE' })
    );
    expect(result).toEqual(restored);
  });

  it('should throw ConflictError when active role with same code exists', async () => {
    const {
      roleSchema,
    } = require('@/core/application/validation/schemas/role.schema');
    roleSchema.safeParse.mockReturnValueOnce({
      success: true,
      data: validInput,
    });
    mockPermissionRepository.findByIds.mockResolvedValueOnce([
      { id: 'perm-1' },
    ]);
    mockRoleRepository.findByCode.mockResolvedValueOnce({
      id: 'role-active',
      deletedAt: null,
    });

    await expect(useCase.execute(validInput)).rejects.toThrow(ConflictError);
  });

  it('should throw NotFoundError when permissionIds are not found', async () => {
    const {
      roleSchema,
    } = require('@/core/application/validation/schemas/role.schema');
    roleSchema.safeParse.mockReturnValueOnce({
      success: true,
      data: validInput,
    });
    mockPermissionRepository.findByIds.mockResolvedValueOnce([]); // none found

    await expect(useCase.execute(validInput)).rejects.toThrow(NotFoundError);
  });

  it('should throw ValidationError on invalid input', async () => {
    const {
      roleSchema,
    } = require('@/core/application/validation/schemas/role.schema');
    roleSchema.safeParse.mockReturnValueOnce({ success: false, error: {} });

    await expect(useCase.execute({} as any)).rejects.toThrow(ValidationError);
  });
});
