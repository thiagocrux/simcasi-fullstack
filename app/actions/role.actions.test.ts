/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  createRole,
  deleteRole,
  findRoles,
  getRole,
  restoreRole,
  updateRole,
} from './role.actions';

jest.mock('@/core/infrastructure/factories/role.factory');
jest.mock('next/cache', () => ({ revalidatePath: jest.fn() }));
jest.mock('@/lib/actions.utils', () => ({
  withSecuredActionAndAutomaticRetry: (_permissions: any, callback: any) =>
    callback(),
}));

import * as roleFactory from '@/core/infrastructure/factories/role.factory';
const {
  makeFindRolesUseCase,
  makeGetRoleByIdUseCase,
  makeRegisterRoleUseCase,
  makeUpdateRoleUseCase,
  makeDeleteRoleUseCase,
  makeRestoreRoleUseCase,
} = roleFactory as any;

describe('Role Actions', () => {
  const VALID_UUID = '550e8400-e29b-41d4-a716-446655440000';

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('findRoles', () => {
    it('should execute find use case', async () => {
      const mockUseCase = {
        execute: jest.fn().mockResolvedValue({
          items: [],
          total: 0,
          skip: 0,
          take: 10,
        }),
      };
      makeFindRolesUseCase.mockReturnValue(mockUseCase);

      await findRoles({ skip: 0, take: 10 });

      expect(makeFindRolesUseCase).toHaveBeenCalled();
    });
  });

  describe('getRole', () => {
    it('should retrieve role with valid UUID', async () => {
      const mockUseCase = {
        execute: jest.fn().mockResolvedValue({ id: VALID_UUID }),
      };
      makeGetRoleByIdUseCase.mockReturnValue(mockUseCase);

      await getRole(VALID_UUID);

      expect(makeGetRoleByIdUseCase).toHaveBeenCalled();
    });

    it('should throw ValidationError for invalid UUID', async () => {
      await expect(getRole('invalid-uuid')).rejects.toThrow();
    });
  });

  describe('createRole', () => {
    it('should create role with valid input', async () => {
      const validInput = {
        code: 'ADMIN',
        label: 'Administrator',
      };
      const mockUseCase = {
        execute: jest.fn().mockResolvedValue({ id: VALID_UUID }),
      };
      makeRegisterRoleUseCase.mockReturnValue(mockUseCase);

      await createRole(validInput);

      expect(makeRegisterRoleUseCase).toHaveBeenCalled();
    });
  });

  describe('updateRole', () => {
    it('should update role with valid input', async () => {
      const updateData = { code: 'ADMIN', label: 'Updated Role Label' };
      const mockUseCase = {
        execute: jest.fn().mockResolvedValue({ id: VALID_UUID }),
      };
      makeUpdateRoleUseCase.mockReturnValue(mockUseCase);

      await updateRole(VALID_UUID, updateData);

      expect(makeUpdateRoleUseCase).toHaveBeenCalled();
    });

    it('should throw ValidationError for invalid UUID', async () => {
      await expect(
        updateRole('invalid-id', { code: 'test', label: 'test' })
      ).rejects.toThrow();
    });
  });

  describe('deleteRole', () => {
    it('should delete role with valid UUID', async () => {
      const mockUseCase = {
        execute: jest.fn().mockResolvedValue(undefined),
      };
      makeDeleteRoleUseCase.mockReturnValue(mockUseCase);

      await deleteRole(VALID_UUID);

      expect(makeDeleteRoleUseCase).toHaveBeenCalled();
    });

    it('should throw ValidationError for invalid UUID', async () => {
      await expect(deleteRole('invalid-id')).rejects.toThrow();
    });
  });

  describe('restoreRole', () => {
    it('should restore role with valid UUID', async () => {
      const mockUseCase = {
        execute: jest.fn().mockResolvedValue({ id: VALID_UUID }),
      };
      makeRestoreRoleUseCase.mockReturnValue(mockUseCase);

      await restoreRole(VALID_UUID);

      expect(makeRestoreRoleUseCase).toHaveBeenCalled();
    });

    it('should throw ValidationError for invalid UUID', async () => {
      await expect(restoreRole('invalid-id')).rejects.toThrow();
    });

    it('should throw NotFoundError if role not found', async () => {
      const mockUseCase = {
        execute: jest.fn().mockResolvedValue(null),
      };
      makeRestoreRoleUseCase.mockReturnValue(mockUseCase);

      await expect(restoreRole(VALID_UUID)).rejects.toThrow('Cargo');
    });
  });
});
