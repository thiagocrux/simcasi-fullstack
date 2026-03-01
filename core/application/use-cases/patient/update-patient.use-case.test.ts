/* eslint-disable @typescript-eslint/no-explicit-any */
jest.mock('@/core/infrastructure/lib/request-context', () => ({
  getRequestContext: jest.fn(() => ({
    userId: 'ctx-user-id',
    ipAddress: '127.0.0.1',
    userAgent: 'Jest',
  })),
}));

jest.mock('@/core/application/validation/schemas/patient.schema', () => ({
  patientSchema: {
    partial: jest.fn(() => ({
      safeParse: jest.fn((data: any) => ({ success: true, data })),
    })),
  },
}));

jest.mock('@/core/application/validation/zod.utils', () => ({
  formatZodError: jest.fn(() => ({})),
}));

import { ConflictError, NotFoundError } from '@/core/domain/errors/app.error';
import { UpdatePatientUseCase } from './update-patient.use-case';

const mockPatientRepository = {
  findById: jest.fn(),
  findByCpf: jest.fn(),
  findBySusCardNumber: jest.fn(),
  update: jest.fn(),
};
const mockAuditLogRepository = { create: jest.fn() };

describe('UpdatePatientUseCase', () => {
  let useCase: UpdatePatientUseCase;

  beforeEach(() => {
    jest.clearAllMocks();
    useCase = new UpdatePatientUseCase(
      mockPatientRepository as any,
      mockAuditLogRepository as any
    );
  });

  it('should update the patient and create audit log', async () => {
    const {
      patientSchema,
    } = require('@/core/application/validation/schemas/patient.schema');
    patientSchema.partial.mockReturnValueOnce({
      safeParse: jest.fn(() => ({ success: true, data: { name: 'New' } })),
    });
    mockPatientRepository.findById.mockResolvedValueOnce({
      id: 'p1',
      cpf: '111',
      susCardNumber: '222',
    });
    mockPatientRepository.update.mockResolvedValueOnce({
      id: 'p1',
      name: 'New',
    });

    const result = await useCase.execute({ id: 'p1', name: 'New' } as any);

    expect(mockPatientRepository.update).toHaveBeenCalled();
    expect(mockAuditLogRepository.create).toHaveBeenCalled();
    expect(result).toEqual({ id: 'p1', name: 'New' });
  });

  it('should throw ConflictError when CPF is duplicated', async () => {
    const {
      patientSchema,
    } = require('@/core/application/validation/schemas/patient.schema');
    patientSchema.partial.mockReturnValueOnce({
      safeParse: jest.fn(() => ({
        success: true,
        data: { cpf: '999.999.999-99' },
      })),
    });
    mockPatientRepository.findById.mockResolvedValueOnce({
      id: 'p1',
      cpf: '111.111.111-11',
    });
    mockPatientRepository.findByCpf.mockResolvedValueOnce({ id: 'p-other' });

    await expect(
      useCase.execute({ id: 'p1', cpf: '999.999.999-99' } as any)
    ).rejects.toThrow(ConflictError);
  });

  it('should throw ConflictError when SUS card is duplicated', async () => {
    const {
      patientSchema,
    } = require('@/core/application/validation/schemas/patient.schema');
    patientSchema.partial.mockReturnValueOnce({
      safeParse: jest.fn(() => ({
        success: true,
        data: { susCardNumber: '999 9999 9999 9999' },
      })),
    });
    mockPatientRepository.findById.mockResolvedValueOnce({
      id: 'p1',
      cpf: '111',
      susCardNumber: '000 0000 0000 0000',
    });
    mockPatientRepository.findBySusCardNumber.mockResolvedValueOnce({
      id: 'p-other',
    });

    await expect(
      useCase.execute({ id: 'p1', susCardNumber: '999 9999 9999 9999' } as any)
    ).rejects.toThrow(ConflictError);
  });

  it('should throw NotFoundError when patient does not exist', async () => {
    const {
      patientSchema,
    } = require('@/core/application/validation/schemas/patient.schema');
    patientSchema.partial.mockReturnValueOnce({
      safeParse: jest.fn(() => ({ success: true, data: {} })),
    });
    mockPatientRepository.findById.mockResolvedValueOnce(null);

    await expect(useCase.execute({ id: 'x' } as any)).rejects.toThrow(
      NotFoundError
    );
  });
});
