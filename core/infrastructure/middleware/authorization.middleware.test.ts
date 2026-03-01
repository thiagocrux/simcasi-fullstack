const mockExecute = jest.fn();

jest.mock('../factories/permission.factory', () => ({
  makeValidatePermissionsUseCase: () => ({ execute: mockExecute }),
}));

import { ForbiddenError } from '@/core/domain/errors/app.error';
import { authorize, checkPermission } from './authorization.middleware';

describe('checkPermission', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should return true when role has the permission', async () => {
    mockExecute.mockResolvedValueOnce({ isAuthorized: true });

    const result = await checkPermission('role-1', 'create:patient');

    expect(mockExecute).toHaveBeenCalledWith({
      roleId: 'role-1',
      requiredPermissions: ['create:patient'],
    });
    expect(result).toBe(true);
  });

  it('should return false when role lacks the permission', async () => {
    mockExecute.mockResolvedValueOnce({ isAuthorized: false });

    const result = await checkPermission('role-1', 'delete:user');

    expect(result).toBe(false);
  });
});

describe('authorize', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should resolve when role is authorized', async () => {
    mockExecute.mockResolvedValueOnce({ isAuthorized: true });

    await expect(
      authorize('role-1', ['create:patient'])
    ).resolves.toBeUndefined();
  });

  it('should throw ForbiddenError when role is not authorized', async () => {
    mockExecute.mockResolvedValueOnce({ isAuthorized: false });

    await expect(authorize('role-1', ['admin:action'])).rejects.toThrow(
      ForbiddenError
    );
  });

  it('should skip the check when requiredPermissions is empty', async () => {
    await expect(authorize('role-1', [])).resolves.toBeUndefined();
    expect(mockExecute).not.toHaveBeenCalled();
  });
});
