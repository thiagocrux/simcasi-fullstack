import { DeletePermissionUseCase } from '@/core/application/use-cases/permission/delete-permission.use-case';
import { FindPermissionsUseCase } from '@/core/application/use-cases/permission/find-permissions.use-case';
import { GetPermissionByIdUseCase } from '@/core/application/use-cases/permission/get-permission-by-id.use-case';
import { RegisterPermissionUseCase } from '@/core/application/use-cases/permission/register-permission.use-case';
import { RestorePermissionUseCase } from '@/core/application/use-cases/permission/restore-permission.use-case';
import { UpdatePermissionUseCase } from '@/core/application/use-cases/permission/update-permission.use-case';
import { ValidatePermissionsUseCase } from '@/core/application/use-cases/permission/validate-permissions.use-case';
import {
  makeDeletePermissionUseCase,
  makeFindPermissionsUseCase,
  makeGetPermissionByIdUseCase,
  makeRegisterPermissionUseCase,
  makeRestorePermissionUseCase,
  makeUpdatePermissionUseCase,
  makeValidatePermissionsUseCase,
} from './permission.factory';

describe('permission.factory', () => {
  describe('makeRegisterPermissionUseCase', () => {
    it('should return an instance of RegisterPermissionUseCase', () => {
      const useCase = makeRegisterPermissionUseCase();
      expect(useCase).toBeInstanceOf(RegisterPermissionUseCase);
    });

    it('should have execute method', () => {
      const useCase = makeRegisterPermissionUseCase();
      expect(useCase.execute).toBeDefined();
    });

    it('should return a new instance each time it is called', () => {
      const useCase1 = makeRegisterPermissionUseCase();
      const useCase2 = makeRegisterPermissionUseCase();
      expect(useCase1).not.toBe(useCase2);
    });
  });

  describe('makeFindPermissionsUseCase', () => {
    it('should return an instance of FindPermissionsUseCase', () => {
      const useCase = makeFindPermissionsUseCase();
      expect(useCase).toBeInstanceOf(FindPermissionsUseCase);
    });

    it('should have execute method', () => {
      const useCase = makeFindPermissionsUseCase();
      expect(useCase.execute).toBeDefined();
    });

    it('should return a new instance each time it is called', () => {
      const useCase1 = makeFindPermissionsUseCase();
      const useCase2 = makeFindPermissionsUseCase();
      expect(useCase1).not.toBe(useCase2);
    });
  });

  describe('makeGetPermissionByIdUseCase', () => {
    it('should return an instance of GetPermissionByIdUseCase', () => {
      const useCase = makeGetPermissionByIdUseCase();
      expect(useCase).toBeInstanceOf(GetPermissionByIdUseCase);
    });

    it('should have execute method', () => {
      const useCase = makeGetPermissionByIdUseCase();
      expect(useCase.execute).toBeDefined();
    });

    it('should return a new instance each time it is called', () => {
      const useCase1 = makeGetPermissionByIdUseCase();
      const useCase2 = makeGetPermissionByIdUseCase();
      expect(useCase1).not.toBe(useCase2);
    });
  });

  describe('makeUpdatePermissionUseCase', () => {
    it('should return an instance of UpdatePermissionUseCase', () => {
      const useCase = makeUpdatePermissionUseCase();
      expect(useCase).toBeInstanceOf(UpdatePermissionUseCase);
    });

    it('should have execute method', () => {
      const useCase = makeUpdatePermissionUseCase();
      expect(useCase.execute).toBeDefined();
    });

    it('should return a new instance each time it is called', () => {
      const useCase1 = makeUpdatePermissionUseCase();
      const useCase2 = makeUpdatePermissionUseCase();
      expect(useCase1).not.toBe(useCase2);
    });
  });

  describe('makeDeletePermissionUseCase', () => {
    it('should return an instance of DeletePermissionUseCase', () => {
      const useCase = makeDeletePermissionUseCase();
      expect(useCase).toBeInstanceOf(DeletePermissionUseCase);
    });

    it('should have execute method', () => {
      const useCase = makeDeletePermissionUseCase();
      expect(useCase.execute).toBeDefined();
    });

    it('should return a new instance each time it is called', () => {
      const useCase1 = makeDeletePermissionUseCase();
      const useCase2 = makeDeletePermissionUseCase();
      expect(useCase1).not.toBe(useCase2);
    });
  });

  describe('makeRestorePermissionUseCase', () => {
    it('should return an instance of RestorePermissionUseCase', () => {
      const useCase = makeRestorePermissionUseCase();
      expect(useCase).toBeInstanceOf(RestorePermissionUseCase);
    });

    it('should have execute method', () => {
      const useCase = makeRestorePermissionUseCase();
      expect(useCase.execute).toBeDefined();
    });

    it('should return a new instance each time it is called', () => {
      const useCase1 = makeRestorePermissionUseCase();
      const useCase2 = makeRestorePermissionUseCase();
      expect(useCase1).not.toBe(useCase2);
    });
  });

  describe('makeValidatePermissionsUseCase', () => {
    it('should return an instance of ValidatePermissionsUseCase', () => {
      const useCase = makeValidatePermissionsUseCase();
      expect(useCase).toBeInstanceOf(ValidatePermissionsUseCase);
    });

    it('should have execute method', () => {
      const useCase = makeValidatePermissionsUseCase();
      expect(useCase.execute).toBeDefined();
    });

    it('should return a new instance each time it is called', () => {
      const useCase1 = makeValidatePermissionsUseCase();
      const useCase2 = makeValidatePermissionsUseCase();
      expect(useCase1).not.toBe(useCase2);
    });
  });
});
