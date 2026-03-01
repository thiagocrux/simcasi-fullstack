import { DeleteRoleUseCase } from '@/core/application/use-cases/role/delete-role.use-case';
import { FindRolesUseCase } from '@/core/application/use-cases/role/find-roles.use-case';
import { GetRoleByIdUseCase } from '@/core/application/use-cases/role/get-role-by-id.use-case';
import { RegisterRoleUseCase } from '@/core/application/use-cases/role/register-role.use-case';
import { RestoreRoleUseCase } from '@/core/application/use-cases/role/restore-role.use-case';
import { UpdateRoleUseCase } from '@/core/application/use-cases/role/update-role.use-case';
import {
  makeDeleteRoleUseCase,
  makeFindRolesUseCase,
  makeGetRoleByIdUseCase,
  makeRegisterRoleUseCase,
  makeRestoreRoleUseCase,
  makeUpdateRoleUseCase,
} from './role.factory';

describe('role.factory', () => {
  describe('makeRegisterRoleUseCase', () => {
    it('should return an instance of RegisterRoleUseCase', () => {
      const useCase = makeRegisterRoleUseCase();
      expect(useCase).toBeInstanceOf(RegisterRoleUseCase);
    });

    it('should have execute method', () => {
      const useCase = makeRegisterRoleUseCase();
      expect(useCase.execute).toBeDefined();
    });

    it('should return a new instance each time it is called', () => {
      const useCase1 = makeRegisterRoleUseCase();
      const useCase2 = makeRegisterRoleUseCase();
      expect(useCase1).not.toBe(useCase2);
    });
  });

  describe('makeFindRolesUseCase', () => {
    it('should return an instance of FindRolesUseCase', () => {
      const useCase = makeFindRolesUseCase();
      expect(useCase).toBeInstanceOf(FindRolesUseCase);
    });

    it('should have execute method', () => {
      const useCase = makeFindRolesUseCase();
      expect(useCase.execute).toBeDefined();
    });

    it('should return a new instance each time it is called', () => {
      const useCase1 = makeFindRolesUseCase();
      const useCase2 = makeFindRolesUseCase();
      expect(useCase1).not.toBe(useCase2);
    });
  });

  describe('makeGetRoleByIdUseCase', () => {
    it('should return an instance of GetRoleByIdUseCase', () => {
      const useCase = makeGetRoleByIdUseCase();
      expect(useCase).toBeInstanceOf(GetRoleByIdUseCase);
    });

    it('should have execute method', () => {
      const useCase = makeGetRoleByIdUseCase();
      expect(useCase.execute).toBeDefined();
    });

    it('should return a new instance each time it is called', () => {
      const useCase1 = makeGetRoleByIdUseCase();
      const useCase2 = makeGetRoleByIdUseCase();
      expect(useCase1).not.toBe(useCase2);
    });
  });

  describe('makeUpdateRoleUseCase', () => {
    it('should return an instance of UpdateRoleUseCase', () => {
      const useCase = makeUpdateRoleUseCase();
      expect(useCase).toBeInstanceOf(UpdateRoleUseCase);
    });

    it('should have execute method', () => {
      const useCase = makeUpdateRoleUseCase();
      expect(useCase.execute).toBeDefined();
    });

    it('should return a new instance each time it is called', () => {
      const useCase1 = makeUpdateRoleUseCase();
      const useCase2 = makeUpdateRoleUseCase();
      expect(useCase1).not.toBe(useCase2);
    });
  });

  describe('makeDeleteRoleUseCase', () => {
    it('should return an instance of DeleteRoleUseCase', () => {
      const useCase = makeDeleteRoleUseCase();
      expect(useCase).toBeInstanceOf(DeleteRoleUseCase);
    });

    it('should have execute method', () => {
      const useCase = makeDeleteRoleUseCase();
      expect(useCase.execute).toBeDefined();
    });

    it('should return a new instance each time it is called', () => {
      const useCase1 = makeDeleteRoleUseCase();
      const useCase2 = makeDeleteRoleUseCase();
      expect(useCase1).not.toBe(useCase2);
    });
  });

  describe('makeRestoreRoleUseCase', () => {
    it('should return an instance of RestoreRoleUseCase', () => {
      const useCase = makeRestoreRoleUseCase();
      expect(useCase).toBeInstanceOf(RestoreRoleUseCase);
    });

    it('should have execute method', () => {
      const useCase = makeRestoreRoleUseCase();
      expect(useCase.execute).toBeDefined();
    });

    it('should return a new instance each time it is called', () => {
      const useCase1 = makeRestoreRoleUseCase();
      const useCase2 = makeRestoreRoleUseCase();
      expect(useCase1).not.toBe(useCase2);
    });
  });
});
