/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  createExam,
  deleteExam,
  findExams,
  getExam,
  updateExam,
} from './exam.actions';

jest.mock('@/core/infrastructure/factories/exam.factory');
jest.mock('next/cache', () => ({ revalidatePath: jest.fn() }));
jest.mock('@/lib/actions.utils', () => ({
  withSecuredActionAndAutomaticRetry: (_permissions: any, callback: any) =>
    callback(),
}));

import * as examFactory from '@/core/infrastructure/factories/exam.factory';
const {
  makeFindExamsUseCase,
  makeGetExamByIdUseCase,
  makeRegisterExamUseCase,
  makeUpdateExamUseCase,
  makeDeleteExamUseCase,
} = examFactory as any;

describe('Exam Actions', () => {
  const VALID_UUID = '550e8400-e29b-41d4-a716-446655440000';

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('findExams', () => {
    it('should execute find use case', async () => {
      const mockUseCase = {
        execute: jest.fn().mockResolvedValue({
          items: [],
          total: 0,
          skip: 0,
          take: 10,
        }),
      };
      makeFindExamsUseCase.mockReturnValue(mockUseCase);

      await findExams({ skip: 0, take: 10 });

      expect(makeFindExamsUseCase).toHaveBeenCalled();
    });
  });

  describe('getExam', () => {
    it('should retrieve exam with valid UUID', async () => {
      const mockUseCase = {
        execute: jest.fn().mockResolvedValue({ id: VALID_UUID }),
      };
      makeGetExamByIdUseCase.mockReturnValue(mockUseCase);

      await getExam(VALID_UUID);

      expect(makeGetExamByIdUseCase).toHaveBeenCalled();
    });

    it('should throw ValidationError for invalid UUID', async () => {
      await expect(getExam('invalid-uuid')).rejects.toThrow();
    });
  });

  describe('createExam', () => {
    it('should create exam with valid input', async () => {
      const validInput = {
        patientId: VALID_UUID,
        treponemalTestType: 'FTA',
        treponemalTestResult: 'Positivo',
        treponemalTestDate: '2025-01-01',
        treponemalTestLocation: 'Lab XYZ',
        nontreponemalVdrlTest: 'VDRL',
        nontreponemalTestTitration: '1:8',
        nontreponemalTestDate: '2025-01-01',
        referenceObservations: 'Sem observações',
        createdBy: VALID_UUID,
      };
      const mockUseCase = {
        execute: jest.fn().mockResolvedValue({ id: VALID_UUID }),
      };
      makeRegisterExamUseCase.mockReturnValue(mockUseCase);

      await createExam(validInput);

      expect(makeRegisterExamUseCase).toHaveBeenCalled();
    });
  });

  describe('updateExam', () => {
    it('should update exam with valid input', async () => {
      const updateData = {
        treponemalTestResult: 'Negativo',
        updatedBy: VALID_UUID,
      };
      const mockUseCase = {
        execute: jest.fn().mockResolvedValue({ id: VALID_UUID }),
      };
      makeUpdateExamUseCase.mockReturnValue(mockUseCase);

      await updateExam(VALID_UUID, updateData);

      expect(makeUpdateExamUseCase).toHaveBeenCalled();
    });

    it('should throw ValidationError for invalid UUID', async () => {
      await expect(
        updateExam('invalid-id', { updatedBy: VALID_UUID })
      ).rejects.toThrow();
    });
  });

  describe('deleteExam', () => {
    it('should delete exam with valid UUID', async () => {
      const mockUseCase = {
        execute: jest.fn().mockResolvedValue(undefined),
      };
      makeDeleteExamUseCase.mockReturnValue(mockUseCase);

      await deleteExam(VALID_UUID);

      expect(makeDeleteExamUseCase).toHaveBeenCalled();
      expect(mockUseCase.execute).toHaveBeenCalledWith({ id: VALID_UUID });
    });

    it('should throw ValidationError for invalid UUID', async () => {
      await expect(deleteExam('invalid-id')).rejects.toThrow();
    });
  });
});
