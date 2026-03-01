import { DeleteExamUseCase } from '@/core/application/use-cases/exam/delete-exam.use-case';
import { FindExamsUseCase } from '@/core/application/use-cases/exam/find-exams.use-case';
import { GetExamByIdUseCase } from '@/core/application/use-cases/exam/get-exam-by-id.use-case';
import { RegisterExamUseCase } from '@/core/application/use-cases/exam/register-exam.use-case';
import { RestoreExamUseCase } from '@/core/application/use-cases/exam/restore-exam.use-case';
import { UpdateExamUseCase } from '@/core/application/use-cases/exam/update-exam.use-case';
import {
  makeDeleteExamUseCase,
  makeFindExamsUseCase,
  makeGetExamByIdUseCase,
  makeRegisterExamUseCase,
  makeRestoreExamUseCase,
  makeUpdateExamUseCase,
} from './exam.factory';

describe('exam.factory', () => {
  describe('makeRegisterExamUseCase', () => {
    it('should return an instance of RegisterExamUseCase', () => {
      const useCase = makeRegisterExamUseCase();
      expect(useCase).toBeInstanceOf(RegisterExamUseCase);
    });

    it('should have execute method', () => {
      const useCase = makeRegisterExamUseCase();
      expect(useCase.execute).toBeDefined();
    });

    it('should return a new instance each time it is called', () => {
      const useCase1 = makeRegisterExamUseCase();
      const useCase2 = makeRegisterExamUseCase();
      expect(useCase1).not.toBe(useCase2);
    });
  });

  describe('makeFindExamsUseCase', () => {
    it('should return an instance of FindExamsUseCase', () => {
      const useCase = makeFindExamsUseCase();
      expect(useCase).toBeInstanceOf(FindExamsUseCase);
    });

    it('should have execute method', () => {
      const useCase = makeFindExamsUseCase();
      expect(useCase.execute).toBeDefined();
    });

    it('should return a new instance each time it is called', () => {
      const useCase1 = makeFindExamsUseCase();
      const useCase2 = makeFindExamsUseCase();
      expect(useCase1).not.toBe(useCase2);
    });
  });

  describe('makeGetExamByIdUseCase', () => {
    it('should return an instance of GetExamByIdUseCase', () => {
      const useCase = makeGetExamByIdUseCase();
      expect(useCase).toBeInstanceOf(GetExamByIdUseCase);
    });

    it('should have execute method', () => {
      const useCase = makeGetExamByIdUseCase();
      expect(useCase.execute).toBeDefined();
    });

    it('should return a new instance each time it is called', () => {
      const useCase1 = makeGetExamByIdUseCase();
      const useCase2 = makeGetExamByIdUseCase();
      expect(useCase1).not.toBe(useCase2);
    });
  });

  describe('makeUpdateExamUseCase', () => {
    it('should return an instance of UpdateExamUseCase', () => {
      const useCase = makeUpdateExamUseCase();
      expect(useCase).toBeInstanceOf(UpdateExamUseCase);
    });

    it('should have execute method', () => {
      const useCase = makeUpdateExamUseCase();
      expect(useCase.execute).toBeDefined();
    });

    it('should return a new instance each time it is called', () => {
      const useCase1 = makeUpdateExamUseCase();
      const useCase2 = makeUpdateExamUseCase();
      expect(useCase1).not.toBe(useCase2);
    });
  });

  describe('makeDeleteExamUseCase', () => {
    it('should return an instance of DeleteExamUseCase', () => {
      const useCase = makeDeleteExamUseCase();
      expect(useCase).toBeInstanceOf(DeleteExamUseCase);
    });

    it('should have execute method', () => {
      const useCase = makeDeleteExamUseCase();
      expect(useCase.execute).toBeDefined();
    });

    it('should return a new instance each time it is called', () => {
      const useCase1 = makeDeleteExamUseCase();
      const useCase2 = makeDeleteExamUseCase();
      expect(useCase1).not.toBe(useCase2);
    });
  });

  describe('makeRestoreExamUseCase', () => {
    it('should return an instance of RestoreExamUseCase', () => {
      const useCase = makeRestoreExamUseCase();
      expect(useCase).toBeInstanceOf(RestoreExamUseCase);
    });

    it('should have execute method', () => {
      const useCase = makeRestoreExamUseCase();
      expect(useCase.execute).toBeDefined();
    });

    it('should return a new instance each time it is called', () => {
      const useCase1 = makeRestoreExamUseCase();
      const useCase2 = makeRestoreExamUseCase();
      expect(useCase1).not.toBe(useCase2);
    });
  });
});
