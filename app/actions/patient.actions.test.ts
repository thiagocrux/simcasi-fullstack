/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  createPatient,
  deletePatient,
  findPatients,
  getPatient,
  restorePatient,
  updatePatient,
} from './patient.actions';

jest.mock('@/core/infrastructure/factories/patient.factory');
jest.mock('next/cache', () => ({ revalidatePath: jest.fn() }));
jest.mock('@/lib/actions.utils', () => ({
  withSecuredActionAndAutomaticRetry: (_permissions: any, callback: any) =>
    callback(),
}));

import * as patientFactory from '@/core/infrastructure/factories/patient.factory';
const {
  makeFindPatientsUseCase,
  makeGetPatientByIdUseCase,
  makeRegisterPatientUseCase,
  makeUpdatePatientUseCase,
  makeDeletePatientUseCase,
  makeRestorePatientUseCase,
} = patientFactory as any;

describe('Patient Actions', () => {
  const VALID_UUID = '550e8400-e29b-41d4-a716-446655440000';

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('findPatients', () => {
    it('should execute find use case with parsed query', async () => {
      const mockUseCase = {
        execute: jest.fn().mockResolvedValue({
          items: [],
          total: 0,
          skip: 0,
          take: 10,
        }),
      };
      makeFindPatientsUseCase.mockReturnValue(mockUseCase);

      await findPatients({ skip: 0, take: 10 });

      expect(makeFindPatientsUseCase).toHaveBeenCalled();
    });
  });

  describe('getPatient', () => {
    it('should retrieve patient with valid UUID', async () => {
      const mockUseCase = {
        execute: jest.fn().mockResolvedValue({ id: VALID_UUID }),
      };
      makeGetPatientByIdUseCase.mockReturnValue(mockUseCase);

      await getPatient(VALID_UUID);

      expect(makeGetPatientByIdUseCase).toHaveBeenCalled();
    });

    it('should throw ValidationError for invalid UUID', async () => {
      await expect(getPatient('invalid-uuid')).rejects.toThrow();
    });
  });

  describe('createPatient', () => {
    it('should create patient with valid input', async () => {
      const validInput = {
        susCardNumber: '123 4567 8901 2345',
        cpf: '123.456.789-10',
        name: 'Test Patient',
        birthDate: '1990-01-01',
        race: 'Branca',
        sex: 'Masculino',
        gender: 'Masculino',
        sexuality: 'Heterossexual',
        nationality: 'Brasileira',
        schooling: 'Superior completo',
        motherName: 'Mother Name',
        isDeceased: false,
        monitoringType: 'ATIVO',
        state: 'SP',
        city: 'São Paulo',
        neighborhood: 'Centro',
        street: 'Rua Test',
        houseNumber: '123',
        createdBy: VALID_UUID,
      };
      const mockUseCase = {
        execute: jest.fn().mockResolvedValue({ id: VALID_UUID, ...validInput }),
      };
      makeRegisterPatientUseCase.mockReturnValue(mockUseCase);

      await createPatient(validInput);

      expect(makeRegisterPatientUseCase).toHaveBeenCalled();
    });
  });

  describe('updatePatient', () => {
    it('should update patient with valid input', async () => {
      const updateData = { name: 'Updated Name', updatedBy: VALID_UUID };
      const mockUseCase = {
        execute: jest.fn().mockResolvedValue({ id: VALID_UUID }),
      };
      makeUpdatePatientUseCase.mockReturnValue(mockUseCase);

      await updatePatient(VALID_UUID, updateData);

      expect(makeUpdatePatientUseCase).toHaveBeenCalled();
    });

    it('should throw ValidationError for invalid UUID', async () => {
      await expect(
        updatePatient('invalid-id', { updatedBy: VALID_UUID })
      ).rejects.toThrow();
    });
  });

  describe('deletePatient', () => {
    it('should delete patient with valid UUID', async () => {
      const mockUseCase = {
        execute: jest.fn().mockResolvedValue(undefined),
      };
      makeDeletePatientUseCase.mockReturnValue(mockUseCase);

      await deletePatient(VALID_UUID);

      expect(makeDeletePatientUseCase).toHaveBeenCalled();
    });
  });

  describe('restorePatient', () => {
    it('should restore patient with valid UUID', async () => {
      const mockUseCase = {
        execute: jest.fn().mockResolvedValue({ id: VALID_UUID }),
      };
      makeRestorePatientUseCase.mockReturnValue(mockUseCase);

      await restorePatient(VALID_UUID);

      expect(makeRestorePatientUseCase).toHaveBeenCalled();
    });

    it('should throw NotFoundError if patient not found', async () => {
      const mockUseCase = {
        execute: jest.fn().mockResolvedValue(null),
      };
      makeRestorePatientUseCase.mockReturnValue(mockUseCase);

      await expect(restorePatient(VALID_UUID)).rejects.toThrow('Paciente');
    });
  });
});
