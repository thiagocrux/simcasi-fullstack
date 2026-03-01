/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  createTreatment,
  deleteTreatment,
  findTreatments,
  getTreatment,
  updateTreatment,
} from './treatment.actions';

jest.mock('@/core/infrastructure/factories/treatment.factory');
jest.mock('next/cache', () => ({ revalidatePath: jest.fn() }));
jest.mock('@/lib/actions.utils', () => ({
  withSecuredActionAndAutomaticRetry: (_permissions: any, callback: any) =>
    callback(),
}));

import * as treatmentFactory from '@/core/infrastructure/factories/treatment.factory';
const {
  makeFindTreatmentsUseCase,
  makeGetTreatmentByIdUseCase,
  makeRegisterTreatmentUseCase,
  makeUpdateTreatmentUseCase,
  makeDeleteTreatmentUseCase,
} = treatmentFactory as any;

describe('Treatment Actions', () => {
  const VALID_UUID = '550e8400-e29b-41d4-a716-446655440000';

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('findTreatments', () => {
    it('should execute find use case', async () => {
      const mockUseCase = {
        execute: jest.fn().mockResolvedValue({
          items: [],
          total: 0,
          skip: 0,
          take: 10,
        }),
      };
      makeFindTreatmentsUseCase.mockReturnValue(mockUseCase);

      await findTreatments({ skip: 0, take: 10 });

      expect(makeFindTreatmentsUseCase).toHaveBeenCalled();
    });
  });

  describe('getTreatment', () => {
    it('should retrieve treatment with valid UUID', async () => {
      const mockUseCase = {
        execute: jest.fn().mockResolvedValue({ id: VALID_UUID }),
      };
      makeGetTreatmentByIdUseCase.mockReturnValue(mockUseCase);

      await getTreatment(VALID_UUID);

      expect(makeGetTreatmentByIdUseCase).toHaveBeenCalled();
    });

    it('should throw ValidationError for invalid UUID', async () => {
      await expect(getTreatment('invalid-uuid')).rejects.toThrow();
    });
  });

  describe('createTreatment', () => {
    it('should create treatment with valid input', async () => {
      const validInput = {
        patientId: VALID_UUID,
        medication: 'Penicilina',
        healthCenter: 'Centro de Saúde A',
        startDate: '2025-01-15',
        dosage: '2.4 MU',
        createdBy: VALID_UUID,
      };
      const mockUseCase = {
        execute: jest.fn().mockResolvedValue({ id: VALID_UUID }),
      };
      makeRegisterTreatmentUseCase.mockReturnValue(mockUseCase);

      await createTreatment(validInput);

      expect(makeRegisterTreatmentUseCase).toHaveBeenCalled();
    });
  });

  describe('updateTreatment', () => {
    it('should update treatment with valid input', async () => {
      const updateData = { dosage: '4.8 MU', updatedBy: VALID_UUID };
      const mockUseCase = {
        execute: jest.fn().mockResolvedValue({ id: VALID_UUID }),
      };
      makeUpdateTreatmentUseCase.mockReturnValue(mockUseCase);

      await updateTreatment(VALID_UUID, updateData);

      expect(makeUpdateTreatmentUseCase).toHaveBeenCalled();
    });

    it('should throw ValidationError for invalid UUID', async () => {
      await expect(
        updateTreatment('invalid-id', { updatedBy: VALID_UUID })
      ).rejects.toThrow();
    });
  });

  describe('deleteTreatment', () => {
    it('should delete treatment with valid UUID', async () => {
      const mockUseCase = {
        execute: jest.fn().mockResolvedValue(undefined),
      };
      makeDeleteTreatmentUseCase.mockReturnValue(mockUseCase);

      await deleteTreatment(VALID_UUID);

      expect(makeDeleteTreatmentUseCase).toHaveBeenCalled();
    });

    it('should throw ValidationError for invalid UUID', async () => {
      await expect(deleteTreatment('invalid-id')).rejects.toThrow();
    });
  });
});
