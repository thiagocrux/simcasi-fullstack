/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  createObservation,
  deleteObservation,
  findObservations,
  getObservation,
  updateObservation,
} from './observation.actions';

jest.mock('@/core/infrastructure/factories/observation.factory');
jest.mock('next/cache', () => ({ revalidatePath: jest.fn() }));
jest.mock('@/lib/actions.utils', () => ({
  withSecuredActionAndAutomaticRetry: (_permissions: any, callback: any) =>
    callback(),
}));

import * as observationFactory from '@/core/infrastructure/factories/observation.factory';
const {
  makeFindObservationsUseCase,
  makeGetObservationByIdUseCase,
  makeRegisterObservationUseCase,
  makeUpdateObservationUseCase,
  makeDeleteObservationUseCase,
} = observationFactory as any;

describe('Observation Actions', () => {
  const VALID_UUID = '550e8400-e29b-41d4-a716-446655440000';

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('findObservations', () => {
    it('should execute find use case', async () => {
      const mockUseCase = {
        execute: jest.fn().mockResolvedValue({
          items: [],
          total: 0,
          skip: 0,
          take: 10,
        }),
      };
      makeFindObservationsUseCase.mockReturnValue(mockUseCase);

      await findObservations({ skip: 0, take: 10 });

      expect(makeFindObservationsUseCase).toHaveBeenCalled();
    });
  });

  describe('getObservation', () => {
    it('should retrieve observation with valid UUID', async () => {
      const mockUseCase = {
        execute: jest.fn().mockResolvedValue({ id: VALID_UUID }),
      };
      makeGetObservationByIdUseCase.mockReturnValue(mockUseCase);

      await getObservation(VALID_UUID);

      expect(makeGetObservationByIdUseCase).toHaveBeenCalled();
    });

    it('should throw ValidationError for invalid UUID', async () => {
      await expect(getObservation('invalid-uuid')).rejects.toThrow();
    });
  });

  describe('createObservation', () => {
    it('should create observation with valid input', async () => {
      const validInput = {
        patientId: VALID_UUID,
        hasPartnerBeingTreated: true,
        createdBy: VALID_UUID,
      };
      const mockUseCase = {
        execute: jest.fn().mockResolvedValue({ id: VALID_UUID }),
      };
      makeRegisterObservationUseCase.mockReturnValue(mockUseCase);

      await createObservation(validInput);

      expect(makeRegisterObservationUseCase).toHaveBeenCalled();
    });
  });

  describe('updateObservation', () => {
    it('should update observation with valid input', async () => {
      const updateData = {
        hasPartnerBeingTreated: false,
        updatedBy: VALID_UUID,
      };
      const mockUseCase = {
        execute: jest.fn().mockResolvedValue({ id: VALID_UUID }),
      };
      makeUpdateObservationUseCase.mockReturnValue(mockUseCase);

      await updateObservation(VALID_UUID, updateData);

      expect(makeUpdateObservationUseCase).toHaveBeenCalled();
    });

    it('should throw ValidationError for invalid UUID', async () => {
      await expect(
        updateObservation('invalid-id', { updatedBy: VALID_UUID })
      ).rejects.toThrow();
    });
  });

  describe('deleteObservation', () => {
    it('should delete observation with valid UUID', async () => {
      const mockUseCase = {
        execute: jest.fn().mockResolvedValue(undefined),
      };
      makeDeleteObservationUseCase.mockReturnValue(mockUseCase);

      await deleteObservation(VALID_UUID);

      expect(makeDeleteObservationUseCase).toHaveBeenCalled();
    });

    it('should throw ValidationError for invalid UUID', async () => {
      await expect(deleteObservation('invalid-id')).rejects.toThrow();
    });
  });
});
