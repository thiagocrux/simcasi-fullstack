import { DeletePatientUseCase } from '@/core/application/use-cases/patient/delete-patient.use-case';
import { FindPatientsUseCase } from '@/core/application/use-cases/patient/find-patients.use-case';
import { GetPatientByIdUseCase } from '@/core/application/use-cases/patient/get-patient-by-id.use-case';
import { RegisterPatientUseCase } from '@/core/application/use-cases/patient/register-patient.use-case';
import { RestorePatientUseCase } from '@/core/application/use-cases/patient/restore-patient.use-case';
import { UpdatePatientUseCase } from '@/core/application/use-cases/patient/update-patient.use-case';
import {
  makeDeletePatientUseCase,
  makeFindPatientsUseCase,
  makeGetPatientByIdUseCase,
  makeRegisterPatientUseCase,
  makeRestorePatientUseCase,
  makeUpdatePatientUseCase,
} from './patient.factory';

describe('patient.factory', () => {
  describe('makeRegisterPatientUseCase', () => {
    it('should return an instance of RegisterPatientUseCase', () => {
      const useCase = makeRegisterPatientUseCase();
      expect(useCase).toBeInstanceOf(RegisterPatientUseCase);
    });

    it('should have execute method', () => {
      const useCase = makeRegisterPatientUseCase();
      expect(useCase.execute).toBeDefined();
    });

    it('should return a new instance each time it is called', () => {
      const useCase1 = makeRegisterPatientUseCase();
      const useCase2 = makeRegisterPatientUseCase();
      expect(useCase1).not.toBe(useCase2);
    });
  });

  describe('makeFindPatientsUseCase', () => {
    it('should return an instance of FindPatientsUseCase', () => {
      const useCase = makeFindPatientsUseCase();
      expect(useCase).toBeInstanceOf(FindPatientsUseCase);
    });

    it('should have execute method', () => {
      const useCase = makeFindPatientsUseCase();
      expect(useCase.execute).toBeDefined();
    });

    it('should return a new instance each time it is called', () => {
      const useCase1 = makeFindPatientsUseCase();
      const useCase2 = makeFindPatientsUseCase();
      expect(useCase1).not.toBe(useCase2);
    });
  });

  describe('makeGetPatientByIdUseCase', () => {
    it('should return an instance of GetPatientByIdUseCase', () => {
      const useCase = makeGetPatientByIdUseCase();
      expect(useCase).toBeInstanceOf(GetPatientByIdUseCase);
    });

    it('should have execute method', () => {
      const useCase = makeGetPatientByIdUseCase();
      expect(useCase.execute).toBeDefined();
    });

    it('should return a new instance each time it is called', () => {
      const useCase1 = makeGetPatientByIdUseCase();
      const useCase2 = makeGetPatientByIdUseCase();
      expect(useCase1).not.toBe(useCase2);
    });
  });

  describe('makeUpdatePatientUseCase', () => {
    it('should return an instance of UpdatePatientUseCase', () => {
      const useCase = makeUpdatePatientUseCase();
      expect(useCase).toBeInstanceOf(UpdatePatientUseCase);
    });

    it('should have execute method', () => {
      const useCase = makeUpdatePatientUseCase();
      expect(useCase.execute).toBeDefined();
    });

    it('should return a new instance each time it is called', () => {
      const useCase1 = makeUpdatePatientUseCase();
      const useCase2 = makeUpdatePatientUseCase();
      expect(useCase1).not.toBe(useCase2);
    });
  });

  describe('makeDeletePatientUseCase', () => {
    it('should return an instance of DeletePatientUseCase', () => {
      const useCase = makeDeletePatientUseCase();
      expect(useCase).toBeInstanceOf(DeletePatientUseCase);
    });

    it('should have execute method', () => {
      const useCase = makeDeletePatientUseCase();
      expect(useCase.execute).toBeDefined();
    });

    it('should return a new instance each time it is called', () => {
      const useCase1 = makeDeletePatientUseCase();
      const useCase2 = makeDeletePatientUseCase();
      expect(useCase1).not.toBe(useCase2);
    });
  });

  describe('makeRestorePatientUseCase', () => {
    it('should return an instance of RestorePatientUseCase', () => {
      const useCase = makeRestorePatientUseCase();
      expect(useCase).toBeInstanceOf(RestorePatientUseCase);
    });

    it('should have execute method', () => {
      const useCase = makeRestorePatientUseCase();
      expect(useCase.execute).toBeDefined();
    });

    it('should return a new instance each time it is called', () => {
      const useCase1 = makeRestorePatientUseCase();
      const useCase2 = makeRestorePatientUseCase();
      expect(useCase1).not.toBe(useCase2);
    });
  });
});
