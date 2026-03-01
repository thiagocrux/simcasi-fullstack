const mockExecute = jest.fn();

jest.mock('../factories/session.factory', () => ({
  makeValidateSessionUseCase: () => ({ execute: mockExecute }),
}));

import { InvalidTokenError } from '@/core/domain/errors/session.error';
import { authenticateRequest } from './authentication.middleware';

/**
 * Creates a minimal mock of NextRequest.
 */
function mockNextRequest(
  options: {
    authHeader?: string | null;
    cookie?: string;
  } = {}
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
): any {
  return {
    headers: {
      get: jest.fn((key: string) => {
        if (key === 'authorization') return options.authHeader ?? null;
        return null;
      }),
    },
    cookies: {
      get: jest.fn((name: string) => {
        if (name === 'access_token' && options.cookie) {
          return { value: options.cookie };
        }
        return undefined;
      }),
    },
  };
}

describe('authenticateRequest', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  const authContext = {
    userId: 'user-1',
    roleId: 'role-1',
    roleCode: 'admin',
    sessionId: 'session-1',
  };

  it('should use tokenOverride when provided', async () => {
    mockExecute.mockResolvedValueOnce(authContext);
    const request = mockNextRequest();

    const result = await authenticateRequest(request, 'override-token');

    expect(mockExecute).toHaveBeenCalledWith({ token: 'override-token' });
    expect(result).toEqual(authContext);
  });

  it('should extract token from Authorization header with Bearer prefix', async () => {
    mockExecute.mockResolvedValueOnce(authContext);
    const request = mockNextRequest({ authHeader: 'Bearer my-token' });

    const result = await authenticateRequest(request);

    expect(mockExecute).toHaveBeenCalledWith({ token: 'my-token' });
    expect(result).toEqual(authContext);
  });

  it('should extract token from Authorization header without Bearer prefix', async () => {
    mockExecute.mockResolvedValueOnce(authContext);
    const request = mockNextRequest({ authHeader: 'raw-token-value' });

    const result = await authenticateRequest(request);

    expect(mockExecute).toHaveBeenCalledWith({ token: 'raw-token-value' });
    expect(result).toEqual(authContext);
  });

  it('should fall back to access_token cookie when no header is present', async () => {
    mockExecute.mockResolvedValueOnce(authContext);
    const request = mockNextRequest({ cookie: 'cookie-token' });

    const result = await authenticateRequest(request);

    expect(mockExecute).toHaveBeenCalledWith({ token: 'cookie-token' });
    expect(result).toEqual(authContext);
  });

  it('should prioritize Authorization header over cookie', async () => {
    mockExecute.mockResolvedValueOnce(authContext);
    const request = mockNextRequest({
      authHeader: 'Bearer header-token',
      cookie: 'cookie-token',
    });

    await authenticateRequest(request);

    expect(mockExecute).toHaveBeenCalledWith({ token: 'header-token' });
  });

  it('should throw InvalidTokenError when no token source is available', async () => {
    const request = mockNextRequest();

    await expect(authenticateRequest(request)).rejects.toThrow(
      InvalidTokenError
    );
    expect(mockExecute).not.toHaveBeenCalled();
  });

  it('should propagate errors from the validate session use case', async () => {
    mockExecute.mockRejectedValueOnce(new Error('Session expired'));
    const request = mockNextRequest({ authHeader: 'Bearer valid-token' });

    await expect(authenticateRequest(request)).rejects.toThrow(
      'Session expired'
    );
  });
});
