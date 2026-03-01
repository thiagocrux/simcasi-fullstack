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
  },
}));

jest.mock('bcryptjs', () => ({
  hash: jest.fn().mockResolvedValue('hashed-password'),
  compare: jest.fn().mockResolvedValue(true),
}));

import { FindSessionsUseCase } from '@/core/application/use-cases/session/find-sessions.use-case';
import { GetSessionByIdUseCase } from '@/core/application/use-cases/session/get-session-by-id.use-case';
import { LoginUseCase } from '@/core/application/use-cases/session/login.use-case';
import { LogoutUseCase } from '@/core/application/use-cases/session/logout.use-case';
import { RefreshTokenUseCase } from '@/core/application/use-cases/session/refresh-token.use-case';
import { RevokeSessionUseCase } from '@/core/application/use-cases/session/revoke-session.use-case';
import { ValidateSessionUseCase } from '@/core/application/use-cases/session/validate-session.use-case';
import {
  makeFindSessionsUseCase,
  makeGetSessionByIdUseCase,
  makeLoginUseCase,
  makeLogoutUseCase,
  makeRefreshTokenUseCase,
  makeRevokeSessionUseCase,
  makeValidateSessionUseCase,
} from './session.factory';

describe('session.factory', () => {
  describe('makeLoginUseCase', () => {
    it('should return an instance of LoginUseCase', () => {
      const useCase = makeLoginUseCase();
      expect(useCase).toBeInstanceOf(LoginUseCase);
    });

    it('should have execute method', () => {
      const useCase = makeLoginUseCase();
      expect(useCase.execute).toBeDefined();
    });

    it('should return a new instance each time it is called', () => {
      const useCase1 = makeLoginUseCase();
      const useCase2 = makeLoginUseCase();
      expect(useCase1).not.toBe(useCase2);
    });
  });

  describe('makeFindSessionsUseCase', () => {
    it('should return an instance of FindSessionsUseCase', () => {
      const useCase = makeFindSessionsUseCase();
      expect(useCase).toBeInstanceOf(FindSessionsUseCase);
    });

    it('should have execute method', () => {
      const useCase = makeFindSessionsUseCase();
      expect(useCase.execute).toBeDefined();
    });

    it('should return a new instance each time it is called', () => {
      const useCase1 = makeFindSessionsUseCase();
      const useCase2 = makeFindSessionsUseCase();
      expect(useCase1).not.toBe(useCase2);
    });
  });

  describe('makeRevokeSessionUseCase', () => {
    it('should return an instance of RevokeSessionUseCase', () => {
      const useCase = makeRevokeSessionUseCase();
      expect(useCase).toBeInstanceOf(RevokeSessionUseCase);
    });

    it('should have execute method', () => {
      const useCase = makeRevokeSessionUseCase();
      expect(useCase.execute).toBeDefined();
    });

    it('should return a new instance each time it is called', () => {
      const useCase1 = makeRevokeSessionUseCase();
      const useCase2 = makeRevokeSessionUseCase();
      expect(useCase1).not.toBe(useCase2);
    });
  });

  describe('makeLogoutUseCase', () => {
    it('should return an instance of LogoutUseCase', () => {
      const useCase = makeLogoutUseCase();
      expect(useCase).toBeInstanceOf(LogoutUseCase);
    });

    it('should have execute method', () => {
      const useCase = makeLogoutUseCase();
      expect(useCase.execute).toBeDefined();
    });

    it('should return a new instance each time it is called', () => {
      const useCase1 = makeLogoutUseCase();
      const useCase2 = makeLogoutUseCase();
      expect(useCase1).not.toBe(useCase2);
    });
  });

  describe('makeRefreshTokenUseCase', () => {
    it('should return an instance of RefreshTokenUseCase', () => {
      const useCase = makeRefreshTokenUseCase();
      expect(useCase).toBeInstanceOf(RefreshTokenUseCase);
    });

    it('should have execute method', () => {
      const useCase = makeRefreshTokenUseCase();
      expect(useCase.execute).toBeDefined();
    });

    it('should return a new instance each time it is called', () => {
      const useCase1 = makeRefreshTokenUseCase();
      const useCase2 = makeRefreshTokenUseCase();
      expect(useCase1).not.toBe(useCase2);
    });
  });

  describe('makeValidateSessionUseCase', () => {
    it('should return an instance of ValidateSessionUseCase', () => {
      const useCase = makeValidateSessionUseCase();
      expect(useCase).toBeInstanceOf(ValidateSessionUseCase);
    });

    it('should have execute method', () => {
      const useCase = makeValidateSessionUseCase();
      expect(useCase.execute).toBeDefined();
    });

    it('should return a new instance each time it is called', () => {
      const useCase1 = makeValidateSessionUseCase();
      const useCase2 = makeValidateSessionUseCase();
      expect(useCase1).not.toBe(useCase2);
    });
  });

  describe('makeGetSessionByIdUseCase', () => {
    it('should return an instance of GetSessionByIdUseCase', () => {
      const useCase = makeGetSessionByIdUseCase();
      expect(useCase).toBeInstanceOf(GetSessionByIdUseCase);
    });

    it('should have execute method', () => {
      const useCase = makeGetSessionByIdUseCase();
      expect(useCase.execute).toBeDefined();
    });

    it('should return a new instance each time it is called', () => {
      const useCase1 = makeGetSessionByIdUseCase();
      const useCase2 = makeGetSessionByIdUseCase();
      expect(useCase1).not.toBe(useCase2);
    });
  });
});
