import { DeleteTreatmentUseCase } from '@/core/application/use-cases/treatment/delete-treatment.use-case';
import { FindTreatmentsUseCase } from '@/core/application/use-cases/treatment/find-treatments.use-case';
import { GetTreatmentByIdUseCase } from '@/core/application/use-cases/treatment/get-treatment-by-id.use-case';
import { RegisterTreatmentUseCase } from '@/core/application/use-cases/treatment/register-treatment.use-case';
import { RestoreTreatmentUseCase } from '@/core/application/use-cases/treatment/restore-treatment.use-case';
import { UpdateTreatmentUseCase } from '@/core/application/use-cases/treatment/update-treatment.use-case';
import {
  makeDeleteTreatmentUseCase,
  makeFindTreatmentsUseCase,
  makeGetTreatmentByIdUseCase,
  makeRegisterTreatmentUseCase,
  makeRestoreTreatmentUseCase,
  makeUpdateTreatmentUseCase,
} from './treatment.factory';

describe('treatment.factory', () => {
  describe('makeRegisterTreatmentUseCase', () => {
    it('should return an instance of RegisterTreatmentUseCase', () => {
      const useCase = makeRegisterTreatmentUseCase();
      expect(useCase).toBeInstanceOf(RegisterTreatmentUseCase);
    });

    it('should have execute method', () => {
      const useCase = makeRegisterTreatmentUseCase();
      expect(useCase.execute).toBeDefined();
    });

    it('should return a new instance each time it is called', () => {
      const useCase1 = makeRegisterTreatmentUseCase();
      const useCase2 = makeRegisterTreatmentUseCase();
      expect(useCase1).not.toBe(useCase2);
    });
  });

  describe('makeFindTreatmentsUseCase', () => {
    it('should return an instance of FindTreatmentsUseCase', () => {
      const useCase = makeFindTreatmentsUseCase();
      expect(useCase).toBeInstanceOf(FindTreatmentsUseCase);
    });

    it('should have execute method', () => {
      const useCase = makeFindTreatmentsUseCase();
      expect(useCase.execute).toBeDefined();
    });

    it('should return a new instance each time it is called', () => {
      const useCase1 = makeFindTreatmentsUseCase();
      const useCase2 = makeFindTreatmentsUseCase();
      expect(useCase1).not.toBe(useCase2);
    });
  });

  describe('makeGetTreatmentByIdUseCase', () => {
    it('should return an instance of GetTreatmentByIdUseCase', () => {
      const useCase = makeGetTreatmentByIdUseCase();
      expect(useCase).toBeInstanceOf(GetTreatmentByIdUseCase);
    });

    it('should have execute method', () => {
      const useCase = makeGetTreatmentByIdUseCase();
      expect(useCase.execute).toBeDefined();
    });

    it('should return a new instance each time it is called', () => {
      const useCase1 = makeGetTreatmentByIdUseCase();
      const useCase2 = makeGetTreatmentByIdUseCase();
      expect(useCase1).not.toBe(useCase2);
    });
  });

  describe('makeUpdateTreatmentUseCase', () => {
    it('should return an instance of UpdateTreatmentUseCase', () => {
      const useCase = makeUpdateTreatmentUseCase();
      expect(useCase).toBeInstanceOf(UpdateTreatmentUseCase);
    });

    it('should have execute method', () => {
      const useCase = makeUpdateTreatmentUseCase();
      expect(useCase.execute).toBeDefined();
    });

    it('should return a new instance each time it is called', () => {
      const useCase1 = makeUpdateTreatmentUseCase();
      const useCase2 = makeUpdateTreatmentUseCase();
      expect(useCase1).not.toBe(useCase2);
    });
  });

  describe('makeDeleteTreatmentUseCase', () => {
    it('should return an instance of DeleteTreatmentUseCase', () => {
      const useCase = makeDeleteTreatmentUseCase();
      expect(useCase).toBeInstanceOf(DeleteTreatmentUseCase);
    });

    it('should have execute method', () => {
      const useCase = makeDeleteTreatmentUseCase();
      expect(useCase.execute).toBeDefined();
    });

    it('should return a new instance each time it is called', () => {
      const useCase1 = makeDeleteTreatmentUseCase();
      const useCase2 = makeDeleteTreatmentUseCase();
      expect(useCase1).not.toBe(useCase2);
    });
  });

  describe('makeRestoreTreatmentUseCase', () => {
    it('should return an instance of RestoreTreatmentUseCase', () => {
      const useCase = makeRestoreTreatmentUseCase();
      expect(useCase).toBeInstanceOf(RestoreTreatmentUseCase);
    });

    it('should have execute method', () => {
      const useCase = makeRestoreTreatmentUseCase();
      expect(useCase.execute).toBeDefined();
    });

    it('should return a new instance each time it is called', () => {
      const useCase1 = makeRestoreTreatmentUseCase();
      const useCase2 = makeRestoreTreatmentUseCase();
      expect(useCase1).not.toBe(useCase2);
    });
  });
});
