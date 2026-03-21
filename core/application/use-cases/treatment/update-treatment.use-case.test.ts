/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-require-imports */
jest.mock('@/core/infrastructure/lib/request-context', () => ({
  getRequestContext: jest.fn(() => ({
    userId: 'ctx-user-id',
    ipAddress: '127.0.0.1',
    userAgent: 'Jest',
  })),
}));

jest.mock('@/core/application/validation/schemas/treatment.schema', () => ({
  treatmentSchema: {
    partial: jest.fn(() => ({
      safeParse: jest.fn((data: any) => ({ success: true, data })),
    })),
  },
}));

jest.mock('@/core/application/validation/zod.utils', () => ({
  formatZodError: jest.fn(() => ({})),
}));

import { NotFoundError } from '@/core/domain/errors/app.error';
import { UpdateTreatmentUseCase } from './update-treatment.use-case';

const mockTreatmentRepository = { findById: jest.fn(), update: jest.fn() };
const mockAuditLogRepository = { create: jest.fn() };

describe('UpdateTreatmentUseCase', () => {
  let useCase: UpdateTreatmentUseCase;

  beforeEach(() => {
    jest.clearAllMocks();
    useCase = new UpdateTreatmentUseCase(
      mockTreatmentRepository as any,
      mockAuditLogRepository as any
    );
  });

  it('should update and create audit log', async () => {
    const {
      treatmentSchema,
    } = require('@/core/application/validation/schemas/treatment.schema');
    treatmentSchema.partial.mockReturnValueOnce({
      safeParse: jest.fn(() => ({
        success: true,
        data: { medication: 'New Med' },
      })),
    });
    mockTreatmentRepository.findById.mockResolvedValueOnce({ id: 't1' });
    mockTreatmentRepository.update.mockResolvedValueOnce({
      id: 't1',
      medication: 'New Med',
    });

    const result = await useCase.execute({
      id: 't1',
      medication: 'New Med',
    } as any);

    expect(mockTreatmentRepository.update).toHaveBeenCalled();
    expect(mockAuditLogRepository.create).toHaveBeenCalledWith(
      expect.objectContaining({ action: 'UPDATE', entityName: 'TREATMENT' })
    );
    expect(result).toEqual({ id: 't1', medication: 'New Med' });
  });

  it('should throw NotFoundError when treatment does not exist', async () => {
    const {
      treatmentSchema,
    } = require('@/core/application/validation/schemas/treatment.schema');
    treatmentSchema.partial.mockReturnValueOnce({
      safeParse: jest.fn(() => ({ success: true, data: {} })),
    });
    mockTreatmentRepository.findById.mockResolvedValueOnce(null);

    await expect(useCase.execute({ id: 'x' } as any)).rejects.toThrow(
      NotFoundError
    );
  });
});
