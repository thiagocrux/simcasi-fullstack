/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-require-imports */
jest.mock('@/core/infrastructure/lib/request-context', () => ({
  getRequestContext: jest.fn(() => ({
    userId: 'ctx-user-id',
    ipAddress: '127.0.0.1',
    userAgent: 'Jest',
  })),
}));

jest.mock('@/core/application/validation/schemas/observation.schema', () => ({
  observationSchema: {
    safeParse: jest.fn((data: any) => ({ success: true, data })),
  },
}));

jest.mock('@/core/application/validation/zod.utils', () => ({
  formatZodError: jest.fn(() => ({})),
}));

import { NotFoundError, ValidationError } from '@/core/domain/errors/app.error';
import { RegisterObservationUseCase } from './register-observation.use-case';

const mockObservationRepository = { create: jest.fn() };
const mockPatientRepository = { findById: jest.fn() };
const mockAuditLogRepository = { create: jest.fn() };

describe('RegisterObservationUseCase', () => {
  let useCase: RegisterObservationUseCase;

  const validInput = {
    patientId: 'patient-1',
    observations: 'Test',
    hasPartnerBeingTreated: false,
  };

  beforeEach(() => {
    jest.clearAllMocks();
    useCase = new RegisterObservationUseCase(
      mockObservationRepository as any,
      mockPatientRepository as any,
      mockAuditLogRepository as any
    );
  });

  it('should create an observation and audit log', async () => {
    const {
      observationSchema,
    } = require('@/core/application/validation/schemas/observation.schema');
    observationSchema.safeParse.mockReturnValueOnce({
      success: true,
      data: validInput,
    });
    mockPatientRepository.findById.mockResolvedValueOnce({ id: 'patient-1' });
    const created = { id: 'obs-1', ...validInput };
    mockObservationRepository.create.mockResolvedValueOnce(created);

    const result = await useCase.execute(validInput);

    expect(result).toEqual(created);
    expect(mockAuditLogRepository.create).toHaveBeenCalledWith(
      expect.objectContaining({ action: 'CREATE', entityName: 'OBSERVATION' })
    );
  });

  it('should throw ValidationError on invalid input', async () => {
    const {
      observationSchema,
    } = require('@/core/application/validation/schemas/observation.schema');
    observationSchema.safeParse.mockReturnValueOnce({
      success: false,
      error: {},
    });

    await expect(useCase.execute({} as any)).rejects.toThrow(ValidationError);
  });

  it('should throw NotFoundError when patient does not exist', async () => {
    const {
      observationSchema,
    } = require('@/core/application/validation/schemas/observation.schema');
    observationSchema.safeParse.mockReturnValueOnce({
      success: true,
      data: validInput,
    });
    mockPatientRepository.findById.mockResolvedValueOnce(null);

    await expect(useCase.execute(validInput)).rejects.toThrow(NotFoundError);
  });
});
