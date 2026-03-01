import { DeleteObservationUseCase } from '@/core/application/use-cases/observation/delete-observation.use-case';
import { FindObservationsUseCase } from '@/core/application/use-cases/observation/find-observations.use-case';
import { GetObservationByIdUseCase } from '@/core/application/use-cases/observation/get-observation-by-id.use-case';
import { RegisterObservationUseCase } from '@/core/application/use-cases/observation/register-observation.use-case';
import { RestoreObservationUseCase } from '@/core/application/use-cases/observation/restore-observation.use-case';
import { UpdateObservationUseCase } from '@/core/application/use-cases/observation/update-observation.use-case';
import {
  makeDeleteObservationUseCase,
  makeFindObservationsUseCase,
  makeGetObservationByIdUseCase,
  makeRegisterObservationUseCase,
  makeRestoreObservationUseCase,
  makeUpdateObservationUseCase,
} from './observation.factory';

describe('observation.factory', () => {
  describe('makeRegisterObservationUseCase', () => {
    it('should return an instance of RegisterObservationUseCase', () => {
      const useCase = makeRegisterObservationUseCase();
      expect(useCase).toBeInstanceOf(RegisterObservationUseCase);
    });

    it('should have execute method', () => {
      const useCase = makeRegisterObservationUseCase();
      expect(useCase.execute).toBeDefined();
    });

    it('should return a new instance each time it is called', () => {
      const useCase1 = makeRegisterObservationUseCase();
      const useCase2 = makeRegisterObservationUseCase();
      expect(useCase1).not.toBe(useCase2);
    });
  });

  describe('makeFindObservationsUseCase', () => {
    it('should return an instance of FindObservationsUseCase', () => {
      const useCase = makeFindObservationsUseCase();
      expect(useCase).toBeInstanceOf(FindObservationsUseCase);
    });

    it('should have execute method', () => {
      const useCase = makeFindObservationsUseCase();
      expect(useCase.execute).toBeDefined();
    });

    it('should return a new instance each time it is called', () => {
      const useCase1 = makeFindObservationsUseCase();
      const useCase2 = makeFindObservationsUseCase();
      expect(useCase1).not.toBe(useCase2);
    });
  });

  describe('makeGetObservationByIdUseCase', () => {
    it('should return an instance of GetObservationByIdUseCase', () => {
      const useCase = makeGetObservationByIdUseCase();
      expect(useCase).toBeInstanceOf(GetObservationByIdUseCase);
    });

    it('should have execute method', () => {
      const useCase = makeGetObservationByIdUseCase();
      expect(useCase.execute).toBeDefined();
    });

    it('should return a new instance each time it is called', () => {
      const useCase1 = makeGetObservationByIdUseCase();
      const useCase2 = makeGetObservationByIdUseCase();
      expect(useCase1).not.toBe(useCase2);
    });
  });

  describe('makeUpdateObservationUseCase', () => {
    it('should return an instance of UpdateObservationUseCase', () => {
      const useCase = makeUpdateObservationUseCase();
      expect(useCase).toBeInstanceOf(UpdateObservationUseCase);
    });

    it('should have execute method', () => {
      const useCase = makeUpdateObservationUseCase();
      expect(useCase.execute).toBeDefined();
    });

    it('should return a new instance each time it is called', () => {
      const useCase1 = makeUpdateObservationUseCase();
      const useCase2 = makeUpdateObservationUseCase();
      expect(useCase1).not.toBe(useCase2);
    });
  });

  describe('makeDeleteObservationUseCase', () => {
    it('should return an instance of DeleteObservationUseCase', () => {
      const useCase = makeDeleteObservationUseCase();
      expect(useCase).toBeInstanceOf(DeleteObservationUseCase);
    });

    it('should have execute method', () => {
      const useCase = makeDeleteObservationUseCase();
      expect(useCase.execute).toBeDefined();
    });

    it('should return a new instance each time it is called', () => {
      const useCase1 = makeDeleteObservationUseCase();
      const useCase2 = makeDeleteObservationUseCase();
      expect(useCase1).not.toBe(useCase2);
    });
  });

  describe('makeRestoreObservationUseCase', () => {
    it('should return an instance of RestoreObservationUseCase', () => {
      const useCase = makeRestoreObservationUseCase();
      expect(useCase).toBeInstanceOf(RestoreObservationUseCase);
    });

    it('should have execute method', () => {
      const useCase = makeRestoreObservationUseCase();
      expect(useCase.execute).toBeDefined();
    });

    it('should return a new instance each time it is called', () => {
      const useCase1 = makeRestoreObservationUseCase();
      const useCase2 = makeRestoreObservationUseCase();
      expect(useCase1).not.toBe(useCase2);
    });
  });
});
