/* eslint-disable @typescript-eslint/no-explicit-any */

// All mocks must be defined BEFORE any imports
jest.mock('jose');
jest.mock('@/core/infrastructure/factories/security.factory', () => ({
  makeTokenProvider: jest.fn(() => ({
    sign: jest.fn().mockResolvedValue('mock-token'),
    verify: jest
      .fn()
      .mockResolvedValue({ userId: '550e8400-e29b-41d4-a716-446655440000' }),
  })),
  makeHashProvider: jest.fn(() => ({
    hash: jest.fn().mockResolvedValue('hashed-password'),
    compare: jest.fn().mockResolvedValue(true),
  })),
}));
jest.mock('@/core/infrastructure/factories/user.factory');
jest.mock('next/cache', () => ({ revalidatePath: jest.fn() }));
jest.mock('@/lib/actions.utils', () => ({
  withSecuredActionAndAutomaticRetry: (_permissions: any, callback: any) => {
    // Simulate context for changePassword
    return callback({ userId: '550e8400-e29b-41d4-a716-446655440001' }).then(
      (result: any) => ({ success: true, data: result })
    );
  },
}));

import {
  changePassword,
  createUser,
  deleteUser,
  findUsers,
  getUser,
  restoreUser,
  updateUser,
} from './user.actions';

import * as userFactory from '@/core/infrastructure/factories/user.factory';
const {
  makeFindUsersUseCase,
  makeGetUserByIdUseCase,
  makeRegisterUserUseCase,
  makeUpdateUserUseCase,
  makeDeleteUserUseCase,
  makeRestoreUserUseCase,
  makeChangePasswordUseCase,
} = userFactory as any;

describe('User Actions', () => {
  const VALID_UUID = '550e8400-e29b-41d4-a716-446655440000';

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('findUsers', () => {
    it('should execute find use case with parsed query', async () => {
      const mockUseCase = {
        execute: jest.fn().mockResolvedValue({
          items: [],
          total: 0,
          skip: 0,
          take: 10,
        }),
      };
      makeFindUsersUseCase.mockReturnValue(mockUseCase);

      await findUsers({ skip: 0, take: 10 });

      expect(makeFindUsersUseCase).toHaveBeenCalled();
      expect(mockUseCase.execute).toHaveBeenCalledWith(
        expect.objectContaining({ skip: 0, take: 10 })
      );
    });

    it('should use default values when query is empty', async () => {
      const mockUseCase = {
        execute: jest.fn().mockResolvedValue({
          items: [],
          total: 0,
          skip: 0,
          take: 10,
        }),
      };
      makeFindUsersUseCase.mockReturnValue(mockUseCase);

      await findUsers();

      expect(mockUseCase.execute).toHaveBeenCalledWith({});
    });
  });

  describe('getUser', () => {
    it('should retrieve user with valid UUID', async () => {
      const mockUseCase = {
        execute: jest.fn().mockResolvedValue({
          id: VALID_UUID,
          name: 'John Doe',
          email: 'john@example.com',
        }),
      };
      makeGetUserByIdUseCase.mockReturnValue(mockUseCase);

      await getUser(VALID_UUID);

      expect(makeGetUserByIdUseCase).toHaveBeenCalled();
      expect(mockUseCase.execute).toHaveBeenCalledWith({ id: VALID_UUID });
    });

    it('should throw ValidationError for invalid UUID', async () => {
      await expect(getUser('invalid-uuid')).rejects.toThrow();
    });
  });

  describe('createUser', () => {
    it('should create user with valid input', async () => {
      const validInput = {
        name: 'Jane Smith',
        email: 'jane@example.com',
        password: 'SecurePass123!',
        roleId: VALID_UUID,
      };
      const mockUseCase = {
        execute: jest.fn().mockResolvedValue({
          id: VALID_UUID,
          ...validInput,
        }),
      };
      makeRegisterUserUseCase.mockReturnValue(mockUseCase);

      await createUser(validInput);

      expect(makeRegisterUserUseCase).toHaveBeenCalled();
      expect(mockUseCase.execute).toHaveBeenCalledWith(validInput);
    });

    it('should throw ValidationError for invalid input', async () => {
      const invalidInput = {
        name: 'Invalid User',
        email: 'not-an-email',
        password: 'short',
        roleId: VALID_UUID,
      };

      await expect(createUser(invalidInput)).rejects.toThrow();
    });
  });

  describe('updateUser', () => {
    it('should update user with valid input', async () => {
      const updateData = {
        name: 'Updated Name',
      };
      const mockUseCase = {
        execute: jest.fn().mockResolvedValue({
          id: VALID_UUID,
          ...updateData,
        }),
      };
      makeUpdateUserUseCase.mockReturnValue(mockUseCase);

      await updateUser(VALID_UUID, updateData);

      expect(makeUpdateUserUseCase).toHaveBeenCalled();
      expect(mockUseCase.execute).toHaveBeenCalledWith({
        id: VALID_UUID,
        ...updateData,
      });
    });

    it('should throw ValidationError for invalid UUID', async () => {
      await expect(
        updateUser('invalid-id', { name: 'Test' })
      ).rejects.toThrow();
    });
  });

  describe('deleteUser', () => {
    it('should delete user with valid UUID', async () => {
      const mockUseCase = {
        execute: jest.fn().mockResolvedValue(undefined),
      };
      makeDeleteUserUseCase.mockReturnValue(mockUseCase);

      await deleteUser(VALID_UUID);

      expect(makeDeleteUserUseCase).toHaveBeenCalled();
      expect(mockUseCase.execute).toHaveBeenCalledWith({ id: VALID_UUID });
    });

    it('should throw ValidationError for invalid UUID', async () => {
      await expect(deleteUser('invalid-id')).rejects.toThrow();
    });
  });

  describe('restoreUser', () => {
    it('should restore user with valid UUID', async () => {
      const mockUseCase = {
        execute: jest.fn().mockResolvedValue({
          id: VALID_UUID,
          name: 'Restored User',
        }),
      };
      makeRestoreUserUseCase.mockReturnValue(mockUseCase);

      await restoreUser(VALID_UUID);

      expect(makeRestoreUserUseCase).toHaveBeenCalled();
      expect(mockUseCase.execute).toHaveBeenCalledWith({ id: VALID_UUID });
    });

    it('should throw ValidationError for invalid UUID', async () => {
      await expect(restoreUser('invalid-id')).rejects.toThrow();
    });

    it('should throw NotFoundError if user does not exist', async () => {
      const mockUseCase = {
        execute: jest.fn().mockResolvedValue(null),
      };
      makeRestoreUserUseCase.mockReturnValue(mockUseCase);

      await expect(restoreUser(VALID_UUID)).rejects.toThrow('Usuário');
    });
  });

  describe('changePassword', () => {
    it('should change password with valid input', async () => {
      const passwordInput = {
        currentPassword: 'OldPass123!',
        newPassword: 'NewPass456!',
        newPasswordConfirmation: 'NewPass456!',
      };
      const mockUseCase = {
        execute: jest.fn().mockResolvedValue({
          id: VALID_UUID,
          name: 'User Name',
        }),
      };
      makeChangePasswordUseCase.mockReturnValue(mockUseCase);

      await changePassword(passwordInput);

      expect(makeChangePasswordUseCase).toHaveBeenCalled();
      expect(mockUseCase.execute).toHaveBeenCalledWith({
        userId: '550e8400-e29b-41d4-a716-446655440001',
        currentPassword: 'OldPass123!',
        newPassword: 'NewPass456!',
      });
    });

    it('should throw ValidationError if passwords do not match', async () => {
      await expect(
        changePassword({
          currentPassword: 'OldPass123!',
          newPassword: 'NewPass456!',
          newPasswordConfirmation: 'DifferentPass!',
        })
      ).rejects.toThrow();
    });
  });
});
