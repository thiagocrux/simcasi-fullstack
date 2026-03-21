/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-require-imports */
jest.mock('@/core/infrastructure/lib/request-context', () => ({
  getRequestContext: jest.fn(() => ({
    userId: 'ctx-user-id',
    ipAddress: '127.0.0.1',
    userAgent: 'Jest',
  })),
}));

jest.mock('@/core/application/validation/schemas/permission.schema', () => ({
  permissionSchema: {
    safeParse: jest.fn((data: any) => ({ success: true, data })),
    partial: jest.fn(() => ({
      safeParse: jest.fn((data: any) => ({ success: true, data })),
    })),
  },
}));

jest.mock('@/core/application/validation/zod.utils', () => ({
  formatZodError: jest.fn(() => ({})),
}));

import { ConflictError, ValidationError } from '@/core/domain/errors/app.error';
import { RegisterPermissionUseCase } from './register-permission.use-case';

const mockPermissionRepository = {
  findByCode: jest.fn(),
  create: jest.fn(),
  update: jest.fn(),
};
const mockAuditLogRepository = { create: jest.fn() };

describe('RegisterPermissionUseCase', () => {
  let useCase: RegisterPermissionUseCase;

  const validInput = { code: 'create:patient', label: 'Create Patient' };

  beforeEach(() => {
    jest.clearAllMocks();
    useCase = new RegisterPermissionUseCase(
      mockPermissionRepository as any,
      mockAuditLogRepository as any
    );
  });

  it('should create a new permission', async () => {
    const {
      permissionSchema,
    } = require('@/core/application/validation/schemas/permission.schema');
    permissionSchema.safeParse.mockReturnValueOnce({
      success: true,
      data: validInput,
    });
    mockPermissionRepository.findByCode.mockResolvedValueOnce(null);
    const created = { id: 'perm-1', ...validInput };
    mockPermissionRepository.create.mockResolvedValueOnce(created);

    const result = await useCase.execute(validInput);

    expect(mockPermissionRepository.create).toHaveBeenCalled();
    expect(mockAuditLogRepository.create).toHaveBeenCalledWith(
      expect.objectContaining({ action: 'CREATE', entityName: 'PERMISSION' })
    );
    expect(result).toEqual(created);
  });

  it('should restore a soft-deleted permission with same code', async () => {
    const {
      permissionSchema,
    } = require('@/core/application/validation/schemas/permission.schema');
    permissionSchema.safeParse.mockReturnValueOnce({
      success: true,
      data: validInput,
    });
    mockPermissionRepository.findByCode.mockResolvedValueOnce({
      id: 'perm-old',
      deletedAt: new Date(),
    });
    const restored = { id: 'perm-old', ...validInput, deletedAt: null };
    mockPermissionRepository.update.mockResolvedValueOnce(restored);

    const result = await useCase.execute(validInput);

    expect(mockPermissionRepository.update).toHaveBeenCalledWith(
      'perm-old',
      expect.objectContaining({ deletedAt: null }),
      'ctx-user-id'
    );
    expect(mockAuditLogRepository.create).toHaveBeenCalledWith(
      expect.objectContaining({ action: 'RESTORE' })
    );
    expect(result).toEqual(restored);
  });

  it('should throw ConflictError when active permission with same code exists', async () => {
    const {
      permissionSchema,
    } = require('@/core/application/validation/schemas/permission.schema');
    permissionSchema.safeParse.mockReturnValueOnce({
      success: true,
      data: validInput,
    });
    mockPermissionRepository.findByCode.mockResolvedValueOnce({
      id: 'perm-active',
      deletedAt: null,
    });

    await expect(useCase.execute(validInput)).rejects.toThrow(ConflictError);
  });

  it('should throw ValidationError on invalid input', async () => {
    const {
      permissionSchema,
    } = require('@/core/application/validation/schemas/permission.schema');
    permissionSchema.safeParse.mockReturnValueOnce({
      success: false,
      error: {},
    });

    await expect(useCase.execute({} as any)).rejects.toThrow(ValidationError);
  });
});
