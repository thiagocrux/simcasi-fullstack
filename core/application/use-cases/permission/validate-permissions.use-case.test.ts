/* eslint-disable @typescript-eslint/no-explicit-any */
import { ValidatePermissionsUseCase } from './validate-permissions.use-case';

const mockRoleRepository = { hasPermissions: jest.fn() };

describe('ValidatePermissionsUseCase', () => {
  let useCase: ValidatePermissionsUseCase;

  beforeEach(() => {
    jest.clearAllMocks();
    useCase = new ValidatePermissionsUseCase(mockRoleRepository as any);
  });

  it('should return isAuthorized true when role has permissions', async () => {
    mockRoleRepository.hasPermissions.mockResolvedValueOnce(true);

    const result = await useCase.execute({
      roleId: 'role-1',
      requiredPermissions: ['create:patient'],
    });

    expect(mockRoleRepository.hasPermissions).toHaveBeenCalledWith('role-1', [
      'create:patient',
    ]);
    expect(result).toEqual({ isAuthorized: true });
  });

  it('should return isAuthorized false when role lacks permissions', async () => {
    mockRoleRepository.hasPermissions.mockResolvedValueOnce(false);

    const result = await useCase.execute({
      roleId: 'role-1',
      requiredPermissions: ['admin:action'],
    });

    expect(result).toEqual({ isAuthorized: false });
  });
});
