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
    partial: jest.fn(() => ({
      safeParse: jest.fn((data: any) => ({ success: true, data })),
    })),
  },
}));

jest.mock('@/core/application/validation/zod.utils', () => ({
  formatZodError: jest.fn(() => ({})),
}));

import { ConflictError, NotFoundError } from '@/core/domain/errors/app.error';
import { UpdatePermissionUseCase } from './update-permission.use-case';

const mockPermissionRepository = {
  findById: jest.fn(),
  findByCode: jest.fn(),
  update: jest.fn(),
};
const mockAuditLogRepository = { create: jest.fn() };

describe('UpdatePermissionUseCase', () => {
  let useCase: UpdatePermissionUseCase;

  beforeEach(() => {
    jest.clearAllMocks();
    useCase = new UpdatePermissionUseCase(
      mockPermissionRepository as any,
      mockAuditLogRepository as any
    );
  });

  it('should update and create audit log', async () => {
    const {
      permissionSchema,
    } = require('@/core/application/validation/schemas/permission.schema');
    permissionSchema.partial.mockReturnValueOnce({
      safeParse: jest.fn(() => ({
        success: true,
        data: { label: 'Updated' },
      })),
    });
    mockPermissionRepository.findById.mockResolvedValueOnce({ id: 'perm-1' });
    mockPermissionRepository.update.mockResolvedValueOnce({
      id: 'perm-1',
      label: 'Updated',
    });

    const result = await useCase.execute({
      id: 'perm-1',
      label: 'Updated',
    } as any);

    expect(mockPermissionRepository.update).toHaveBeenCalled();
    expect(mockAuditLogRepository.create).toHaveBeenCalled();
    expect(result).toEqual({ id: 'perm-1', label: 'Updated' });
  });

  it('should throw ConflictError when changing to existing code', async () => {
    const {
      permissionSchema,
    } = require('@/core/application/validation/schemas/permission.schema');
    permissionSchema.partial.mockReturnValueOnce({
      safeParse: jest.fn(() => ({
        success: true,
        data: { code: 'existing-code' },
      })),
    });
    mockPermissionRepository.findById.mockResolvedValueOnce({ id: 'perm-1' });
    mockPermissionRepository.findByCode.mockResolvedValueOnce({
      id: 'perm-other',
    });

    await expect(
      useCase.execute({ id: 'perm-1', code: 'existing-code' } as any)
    ).rejects.toThrow(ConflictError);
  });

  it('should throw NotFoundError when permission does not exist', async () => {
    const {
      permissionSchema,
    } = require('@/core/application/validation/schemas/permission.schema');
    permissionSchema.partial.mockReturnValueOnce({
      safeParse: jest.fn(() => ({ success: true, data: {} })),
    });
    mockPermissionRepository.findById.mockResolvedValueOnce(null);

    await expect(useCase.execute({ id: 'x' } as any)).rejects.toThrow(
      NotFoundError
    );
  });
});
