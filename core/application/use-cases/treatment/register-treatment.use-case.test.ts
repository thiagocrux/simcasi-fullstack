/* eslint-disable @typescript-eslint/no-explicit-any */
jest.mock('@/core/infrastructure/lib/request-context', () => ({
  getRequestContext: jest.fn(() => ({
    userId: 'ctx-user-id',
    ipAddress: '127.0.0.1',
    userAgent: 'Jest',
  })),
}));

jest.mock('@/core/application/validation/schemas/treatment.schema', () => ({
  treatmentSchema: {
    safeParse: jest.fn((data: any) => ({ success: true, data })),
    partial: jest.fn(() => ({
      safeParse: jest.fn((data: any) => ({ success: true, data })),
    })),
  },
}));

jest.mock('@/core/application/validation/zod.utils', () => ({
  formatZodError: jest.fn(() => ({})),
}));

import { NotFoundError, ValidationError } from '@/core/domain/errors/app.error';
import { RegisterTreatmentUseCase } from './register-treatment.use-case';

const mockTreatmentRepository = { create: jest.fn() };
const mockPatientRepository = { findById: jest.fn() };
const mockAuditLogRepository = { create: jest.fn() };

describe('RegisterTreatmentUseCase', () => {
  let useCase: RegisterTreatmentUseCase;

  const validInput = {
    patientId: 'patient-1',
    medication: 'Penicillin',
    healthCenter: 'Hospital A',
    startDate: '2025-01-01',
    dosage: '500mg',
  };

  beforeEach(() => {
    jest.clearAllMocks();
    useCase = new RegisterTreatmentUseCase(
      mockTreatmentRepository as any,
      mockPatientRepository as any,
      mockAuditLogRepository as any
    );
  });

  it('should create a treatment and audit log', async () => {
    const {
      treatmentSchema,
    } = require('@/core/application/validation/schemas/treatment.schema');
    treatmentSchema.safeParse.mockReturnValueOnce({
      success: true,
      data: validInput,
    });
    mockPatientRepository.findById.mockResolvedValueOnce({ id: 'patient-1' });
    const created = { id: 'treat-1', ...validInput };
    mockTreatmentRepository.create.mockResolvedValueOnce(created);

    const result = await useCase.execute(validInput);

    expect(result).toEqual(created);
    expect(mockAuditLogRepository.create).toHaveBeenCalledWith(
      expect.objectContaining({ action: 'CREATE', entityName: 'TREATMENT' })
    );
  });

  it('should throw ValidationError on invalid input', async () => {
    const {
      treatmentSchema,
    } = require('@/core/application/validation/schemas/treatment.schema');
    treatmentSchema.safeParse.mockReturnValueOnce({
      success: false,
      error: {},
    });

    await expect(useCase.execute({} as any)).rejects.toThrow(ValidationError);
  });

  it('should throw NotFoundError when patient does not exist', async () => {
    const {
      treatmentSchema,
    } = require('@/core/application/validation/schemas/treatment.schema');
    treatmentSchema.safeParse.mockReturnValueOnce({
      success: true,
      data: validInput,
    });
    mockPatientRepository.findById.mockResolvedValueOnce(null);

    await expect(useCase.execute(validInput)).rejects.toThrow(NotFoundError);
  });
});
