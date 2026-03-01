const mockSignJWT = {
  setProtectedHeader: jest.fn().mockReturnThis(),
  setIssuedAt: jest.fn().mockReturnThis(),
  setExpirationTime: jest.fn().mockReturnThis(),
  sign: jest.fn().mockResolvedValue('header.payload.signature'),
};

jest.mock('jose', () => ({
  SignJWT: jest.fn(() => mockSignJWT),
  jwtVerify: jest.fn(),
}));

jest.mock('../lib/env.config', () => ({
  env: {
    JWT_SECRET: 'test-secret-key-minimum-32-chars!!',
    JWT_ACCESS_TOKEN_EXPIRATION: '15m',
    JWT_REFRESH_TOKEN_EXPIRATION: '7d',
    BCRYPT_ROUNDS: '10',
    RESEND_API_KEY: '',
    MAIL_FROM: 'test@example.com',
  },
}));

jest.mock('bcryptjs', () => ({
  hash: jest.fn().mockResolvedValue('hashed-password'),
  compare: jest.fn().mockResolvedValue(true),
}));

jest.mock('../providers/mail.null.provider');
jest.mock('../providers/mail.resend.provider');

import { ChangePasswordUseCase } from '@/core/application/use-cases/user/change-password.use-case';
import { DeleteUserUseCase } from '@/core/application/use-cases/user/delete-user.use-case';
import { FindUsersUseCase } from '@/core/application/use-cases/user/find-users.use-case';
import { GetUserByIdUseCase } from '@/core/application/use-cases/user/get-user-by-id.use-case';
import { RegisterUserUseCase } from '@/core/application/use-cases/user/register-user.use-case';
import { RequestPasswordResetUseCase } from '@/core/application/use-cases/user/request-password-reset.use-case';
import { ResetPasswordUseCase } from '@/core/application/use-cases/user/reset-password.use-case';
import { RestoreUserUseCase } from '@/core/application/use-cases/user/restore-user.use-case';
import { UpdateUserUseCase } from '@/core/application/use-cases/user/update-user.use-case';
import { ValidatePasswordResetTokenUseCase } from '@/core/application/use-cases/user/validate-password-reset-token.use-case';
import {
  makeChangePasswordUseCase,
  makeDeleteUserUseCase,
  makeFindUsersUseCase,
  makeGetUserByIdUseCase,
  makeRegisterUserUseCase,
  makeRequestPasswordResetUseCase,
  makeResetPasswordUseCase,
  makeRestoreUserUseCase,
  makeUpdateUserUseCase,
  makeValidatePasswordResetTokenUseCase,
} from './user.factory';

describe('user.factory', () => {
  describe('makeRegisterUserUseCase', () => {
    it('should return an instance of RegisterUserUseCase', () => {
      const useCase = makeRegisterUserUseCase();
      expect(useCase).toBeInstanceOf(RegisterUserUseCase);
    });

    it('should have execute method', () => {
      const useCase = makeRegisterUserUseCase();
      expect(useCase.execute).toBeDefined();
    });

    it('should return a new instance each time it is called', () => {
      const useCase1 = makeRegisterUserUseCase();
      const useCase2 = makeRegisterUserUseCase();
      expect(useCase1).not.toBe(useCase2);
    });
  });

  describe('makeFindUsersUseCase', () => {
    it('should return an instance of FindUsersUseCase', () => {
      const useCase = makeFindUsersUseCase();
      expect(useCase).toBeInstanceOf(FindUsersUseCase);
    });

    it('should have execute method', () => {
      const useCase = makeFindUsersUseCase();
      expect(useCase.execute).toBeDefined();
    });

    it('should return a new instance each time it is called', () => {
      const useCase1 = makeFindUsersUseCase();
      const useCase2 = makeFindUsersUseCase();
      expect(useCase1).not.toBe(useCase2);
    });
  });

  describe('makeGetUserByIdUseCase', () => {
    it('should return an instance of GetUserByIdUseCase', () => {
      const useCase = makeGetUserByIdUseCase();
      expect(useCase).toBeInstanceOf(GetUserByIdUseCase);
    });

    it('should have execute method', () => {
      const useCase = makeGetUserByIdUseCase();
      expect(useCase.execute).toBeDefined();
    });

    it('should return a new instance each time it is called', () => {
      const useCase1 = makeGetUserByIdUseCase();
      const useCase2 = makeGetUserByIdUseCase();
      expect(useCase1).not.toBe(useCase2);
    });
  });

  describe('makeUpdateUserUseCase', () => {
    it('should return an instance of UpdateUserUseCase', () => {
      const useCase = makeUpdateUserUseCase();
      expect(useCase).toBeInstanceOf(UpdateUserUseCase);
    });

    it('should have execute method', () => {
      const useCase = makeUpdateUserUseCase();
      expect(useCase.execute).toBeDefined();
    });

    it('should return a new instance each time it is called', () => {
      const useCase1 = makeUpdateUserUseCase();
      const useCase2 = makeUpdateUserUseCase();
      expect(useCase1).not.toBe(useCase2);
    });
  });

  describe('makeDeleteUserUseCase', () => {
    it('should return an instance of DeleteUserUseCase', () => {
      const useCase = makeDeleteUserUseCase();
      expect(useCase).toBeInstanceOf(DeleteUserUseCase);
    });

    it('should have execute method', () => {
      const useCase = makeDeleteUserUseCase();
      expect(useCase.execute).toBeDefined();
    });

    it('should return a new instance each time it is called', () => {
      const useCase1 = makeDeleteUserUseCase();
      const useCase2 = makeDeleteUserUseCase();
      expect(useCase1).not.toBe(useCase2);
    });
  });

  describe('makeRestoreUserUseCase', () => {
    it('should return an instance of RestoreUserUseCase', () => {
      const useCase = makeRestoreUserUseCase();
      expect(useCase).toBeInstanceOf(RestoreUserUseCase);
    });

    it('should have execute method', () => {
      const useCase = makeRestoreUserUseCase();
      expect(useCase.execute).toBeDefined();
    });

    it('should return a new instance each time it is called', () => {
      const useCase1 = makeRestoreUserUseCase();
      const useCase2 = makeRestoreUserUseCase();
      expect(useCase1).not.toBe(useCase2);
    });
  });

  describe('makeChangePasswordUseCase', () => {
    it('should return an instance of ChangePasswordUseCase', () => {
      const useCase = makeChangePasswordUseCase();
      expect(useCase).toBeInstanceOf(ChangePasswordUseCase);
    });

    it('should have execute method', () => {
      const useCase = makeChangePasswordUseCase();
      expect(useCase.execute).toBeDefined();
    });

    it('should return a new instance each time it is called', () => {
      const useCase1 = makeChangePasswordUseCase();
      const useCase2 = makeChangePasswordUseCase();
      expect(useCase1).not.toBe(useCase2);
    });
  });

  describe('makeRequestPasswordResetUseCase', () => {
    it('should return an instance of RequestPasswordResetUseCase', () => {
      const useCase = makeRequestPasswordResetUseCase();
      expect(useCase).toBeInstanceOf(RequestPasswordResetUseCase);
    });

    it('should have execute method', () => {
      const useCase = makeRequestPasswordResetUseCase();
      expect(useCase.execute).toBeDefined();
    });

    it('should return a new instance each time it is called', () => {
      const useCase1 = makeRequestPasswordResetUseCase();
      const useCase2 = makeRequestPasswordResetUseCase();
      expect(useCase1).not.toBe(useCase2);
    });
  });

  describe('makeResetPasswordUseCase', () => {
    it('should return an instance of ResetPasswordUseCase', () => {
      const useCase = makeResetPasswordUseCase();
      expect(useCase).toBeInstanceOf(ResetPasswordUseCase);
    });

    it('should have execute method', () => {
      const useCase = makeResetPasswordUseCase();
      expect(useCase.execute).toBeDefined();
    });

    it('should return a new instance each time it is called', () => {
      const useCase1 = makeResetPasswordUseCase();
      const useCase2 = makeResetPasswordUseCase();
      expect(useCase1).not.toBe(useCase2);
    });
  });

  describe('makeValidatePasswordResetTokenUseCase', () => {
    it('should return an instance of ValidatePasswordResetTokenUseCase', () => {
      const useCase = makeValidatePasswordResetTokenUseCase();
      expect(useCase).toBeInstanceOf(ValidatePasswordResetTokenUseCase);
    });

    it('should have execute method', () => {
      const useCase = makeValidatePasswordResetTokenUseCase();
      expect(useCase.execute).toBeDefined();
    });

    it('should return a new instance each time it is called', () => {
      const useCase1 = makeValidatePasswordResetTokenUseCase();
      const useCase2 = makeValidatePasswordResetTokenUseCase();
      expect(useCase1).not.toBe(useCase2);
    });
  });
});
