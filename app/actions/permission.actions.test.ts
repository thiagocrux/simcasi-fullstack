/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  createPermission,
  deletePermission,
  findPermissions,
  getPermission,
  restorePermission,
  updatePermission,
} from './permission.actions';

jest.mock('@/core/infrastructure/factories/permission.factory');
jest.mock('next/cache', () => ({ revalidatePath: jest.fn() }));
jest.mock('@/lib/actions.utils', () => ({
  withSecuredActionAndAutomaticRetry: (_permissions: any, callback: any) =>
    callback(),
}));

import * as permissionFactory from '@/core/infrastructure/factories/permission.factory';
const {
  makeFindPermissionsUseCase,
  makeGetPermissionByIdUseCase,
  makeRegisterPermissionUseCase,
  makeUpdatePermissionUseCase,
  makeDeletePermissionUseCase,
  makeRestorePermissionUseCase,
} = permissionFactory as any;

describe('Permission Actions', () => {
  const VALID_UUID = '550e8400-e29b-41d4-a716-446655440000';

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('findPermissions', () => {
    it('should execute find use case', async () => {
      const mockUseCase = {
        execute: jest.fn().mockResolvedValue({
          items: [],
          total: 0,
          skip: 0,
          take: 10,
        }),
      };
      makeFindPermissionsUseCase.mockReturnValue(mockUseCase);

      await findPermissions({ skip: 0, take: 10 });

      expect(makeFindPermissionsUseCase).toHaveBeenCalled();
    });
  });

  describe('getPermission', () => {
    it('should retrieve permission with valid UUID', async () => {
      const mockUseCase = {
        execute: jest.fn().mockResolvedValue({ id: VALID_UUID }),
      };
      makeGetPermissionByIdUseCase.mockReturnValue(mockUseCase);

      await getPermission(VALID_UUID);

      expect(makeGetPermissionByIdUseCase).toHaveBeenCalled();
    });

    it('should throw ValidationError for invalid UUID', async () => {
      await expect(getPermission('invalid-uuid')).rejects.toThrow();
    });
  });

  describe('createPermission', () => {
    it('should create permission with valid input', async () => {
      const validInput = {
        code: 'read:patient',
        label: 'Read Patient',
      };
      const mockUseCase = {
        execute: jest.fn().mockResolvedValue({ id: VALID_UUID }),
      };
      makeRegisterPermissionUseCase.mockReturnValue(mockUseCase);

      await createPermission(validInput);

      expect(makeRegisterPermissionUseCase).toHaveBeenCalled();
    });
  });

  describe('updatePermission', () => {
    it('should update permission with valid input', async () => {
      const updateData = { code: 'read:patient', label: 'Updated Label' };
      const mockUseCase = {
        execute: jest.fn().mockResolvedValue({ id: VALID_UUID }),
      };
      makeUpdatePermissionUseCase.mockReturnValue(mockUseCase);

      await updatePermission(VALID_UUID, updateData);

      expect(makeUpdatePermissionUseCase).toHaveBeenCalled();
    });

    it('should throw ValidationError for invalid UUID', async () => {
      await expect(
        updatePermission('invalid-id', { code: 'test', label: 'test' })
      ).rejects.toThrow();
    });
  });

  describe('deletePermission', () => {
    it('should delete permission with valid UUID', async () => {
      const mockUseCase = {
        execute: jest.fn().mockResolvedValue(undefined),
      };
      makeDeletePermissionUseCase.mockReturnValue(mockUseCase);

      await deletePermission(VALID_UUID);

      expect(makeDeletePermissionUseCase).toHaveBeenCalled();
    });

    it('should throw ValidationError for invalid UUID', async () => {
      await expect(deletePermission('invalid-id')).rejects.toThrow();
    });
  });

  describe('restorePermission', () => {
    it('should restore permission with valid UUID', async () => {
      const mockUseCase = {
        execute: jest.fn().mockResolvedValue({ id: VALID_UUID }),
      };
      makeRestorePermissionUseCase.mockReturnValue(mockUseCase);

      await restorePermission(VALID_UUID);

      expect(makeRestorePermissionUseCase).toHaveBeenCalled();
    });

    it('should throw ValidationError for invalid UUID', async () => {
      await expect(restorePermission('invalid-id')).rejects.toThrow();
    });

    it('should throw NotFoundError if permission not found', async () => {
      const mockUseCase = {
        execute: jest.fn().mockResolvedValue(null),
      };
      makeRestorePermissionUseCase.mockReturnValue(mockUseCase);

      await expect(restorePermission(VALID_UUID)).rejects.toThrow('Permissão');
    });
  });
});
