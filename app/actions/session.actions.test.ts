/* eslint-disable @typescript-eslint/no-explicit-any */

// All mocks must be defined BEFORE any imports
jest.mock('jose');
jest.mock('@/core/infrastructure/factories/security.factory', () => ({
  makeTokenProvider: jest.fn(() => ({
    sign: jest.fn().mockResolvedValue('mock-token'),
    verify: jest
      .fn()
      .mockResolvedValue({ userId: '550e8400-e29b-41d4-a716-446655440000' }),
    getAccessExpirationInSeconds: jest.fn().mockReturnValue(3600),
    getRefreshExpirationInSeconds: jest.fn().mockReturnValue(604800),
  })),
  makeHashProvider: jest.fn(() => ({
    hash: jest.fn().mockResolvedValue('hashed-password'),
    compare: jest.fn().mockResolvedValue(true),
  })),
}));
jest.mock('@/core/infrastructure/factories/session.factory');
jest.mock('@/core/infrastructure/factories/user.factory');
jest.mock('next/headers', () => ({
  cookies: jest.fn().mockResolvedValue({
    set: jest.fn(),
    delete: jest.fn(),
    get: jest.fn(),
  }),
}));
jest.mock('@/core/infrastructure/lib/request-context', () => ({
  requestContextStore: {
    run: (_context: any, callback: any) => callback(),
  },
}));
jest.mock('@/lib/actions.utils', () => ({
  withSecuredActionAndAutomaticRetry: (_permissions: any, callback: any) => {
    return Promise.resolve(callback()).then((result: any) => ({
      success: true,
      data: result,
    }));
  },
  getAuditMetadata: jest.fn().mockResolvedValue({
    ipAddress: '127.0.0.1',
    userAgent: 'Test Agent',
  }),
  handleActionError: jest.fn((error: any) => ({ success: false, error })),
}));
jest.mock('@/lib/logger.utils', () => ({
  logger: {
    info: jest.fn(),
    success: jest.fn(),
    warn: jest.fn(),
    error: jest.fn(),
  },
}));

import {
  getSession,
  logInUser,
  logOutUser,
  requestPasswordReset,
  resetPassword,
} from './session.actions';

import * as securityFactory from '@/core/infrastructure/factories/security.factory';
import * as sessionFactory from '@/core/infrastructure/factories/session.factory';
import * as userFactory from '@/core/infrastructure/factories/user.factory';
const {
  makeGetSessionByIdUseCase,
  makeLoginUseCase,
  makeLogoutUseCase,
  makeValidateSessionUseCase,
} = sessionFactory as any;
const { makeRequestPasswordResetUseCase, makeResetPasswordUseCase } =
  userFactory as any;
const { makeTokenProvider } = securityFactory as any;

describe('Session Actions', () => {
  const VALID_UUID = '550e8400-e29b-41d4-a716-446655440000';

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('logInUser', () => {
    it('should log in user with valid credentials', async () => {
      const loginInput = {
        email: 'user@example.com',
        password: 'SecurePass123!',
        rememberMe: false,
      };
      const mockUseCase = {
        execute: jest.fn().mockResolvedValue({
          accessToken: 'token123',
          refreshToken: 'refresh123',
          user: { id: VALID_UUID, email: 'user@example.com' },
          permissions: [],
        }),
      };
      makeLoginUseCase.mockReturnValue(mockUseCase);

      makeTokenProvider.mockReturnValue({
        getAccessExpirationInSeconds: jest.fn().mockReturnValue(3600),
        getRefreshExpirationInSeconds: jest.fn().mockReturnValue(604800),
      });

      const result = await logInUser(loginInput);

      expect(result.success).toBe(true);
      expect(makeLoginUseCase).toHaveBeenCalled();
    });

    it('should return validation error for invalid input', async () => {
      const result = await logInUser({
        email: 'user@example.com',
        password: '',
        rememberMe: false,
      });

      expect(result.success).toBe(false);
    });
  });

  describe('logOutUser', () => {
    it('should log out user successfully', async () => {
      const mockValidateUseCase = {
        execute: jest.fn().mockResolvedValue({ sessionId: VALID_UUID }),
      };
      makeValidateSessionUseCase.mockReturnValue(mockValidateUseCase);

      const mockLogoutUseCase = {
        execute: jest.fn().mockResolvedValue(undefined),
      };
      makeLogoutUseCase.mockReturnValue(mockLogoutUseCase);

      const result = await logOutUser();

      expect(result.success).toBe(true);
    });
  });

  describe('requestPasswordReset', () => {
    it('should request password reset with valid email', async () => {
      const mockUseCase = {
        execute: jest.fn().mockResolvedValue({
          message: 'Check your email for password reset link',
        }),
      };
      makeRequestPasswordResetUseCase.mockReturnValue(mockUseCase);

      const result = await requestPasswordReset({
        registeredEmail: 'user@example.com',
      });

      expect(result.success).toBe(true);
      expect(makeRequestPasswordResetUseCase).toHaveBeenCalled();
    });

    it('should return validation error for invalid email', async () => {
      const result = await requestPasswordReset({
        registeredEmail: 'invalid-email',
      });

      expect(result.success).toBe(false);
    });
  });

  describe('resetPassword', () => {
    it('should reset password with valid token and matching passwords', async () => {
      const mockUseCase = {
        execute: jest.fn().mockResolvedValue(undefined),
      };
      makeResetPasswordUseCase.mockReturnValue(mockUseCase);

      const result = await resetPassword({
        token: 'reset-token-123',
        newPassword: 'NewPass456!',
        newPasswordConfirmation: 'NewPass456!',
      });

      expect(result.success).toBe(true);
    });

    it('should return error if passwords do not match', async () => {
      const result = await resetPassword({
        token: 'reset-token-123',
        newPassword: 'NewPass456!',
        newPasswordConfirmation: 'DifferentPass!',
      });

      expect(result.success).toBe(false);
    });
  });

  describe('getSession', () => {
    it('should retrieve session with valid UUID', async () => {
      const mockUseCase = {
        execute: jest.fn().mockResolvedValue({
          id: VALID_UUID,
          userId: VALID_UUID,
        }),
      };
      makeGetSessionByIdUseCase.mockReturnValue(mockUseCase);

      await getSession(VALID_UUID);

      expect(makeGetSessionByIdUseCase).toHaveBeenCalled();
    });

    it('should throw ValidationError for invalid UUID', async () => {
      await expect(getSession('invalid-uuid')).rejects.toThrow();
    });
  });
});
