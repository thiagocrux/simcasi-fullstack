/* eslint-disable @typescript-eslint/no-explicit-any */
jest.mock('@/core/infrastructure/lib/request-context', () => ({
  getRequestContext: jest.fn(() => ({
    userId: 'ctx-user-id',
    ipAddress: '127.0.0.1',
    userAgent: 'Jest',
  })),
}));

jest.mock('@/core/application/validation/schemas/exam.schema', () => ({
  examSchema: {
    partial: jest.fn(() => ({
      safeParse: jest.fn((data: any) => ({ success: true, data })),
    })),
  },
}));

jest.mock('@/core/application/validation/zod.utils', () => ({
  formatZodError: jest.fn(() => ({})),
}));

import { NotFoundError, ValidationError } from '@/core/domain/errors/app.error';
import { UpdateExamUseCase } from './update-exam.use-case';

const mockExamRepository = { findById: jest.fn(), update: jest.fn() };
const mockAuditLogRepository = { create: jest.fn() };

describe('UpdateExamUseCase', () => {
  let useCase: UpdateExamUseCase;

  beforeEach(() => {
    jest.clearAllMocks();
    useCase = new UpdateExamUseCase(
      mockExamRepository as any,
      mockAuditLogRepository as any
    );
  });

  it('should update the exam and create audit log', async () => {
    const existing = { id: 'exam-1', patientId: 'p1' };
    const updated = { ...existing, referenceObservations: 'Updated' };
    const {
      examSchema,
    } = require('@/core/application/validation/schemas/exam.schema');
    examSchema.partial.mockReturnValueOnce({
      safeParse: jest.fn(() => ({
        success: true,
        data: { referenceObservations: 'Updated' },
      })),
    });
    mockExamRepository.findById.mockResolvedValueOnce(existing);
    mockExamRepository.update.mockResolvedValueOnce(updated);

    const result = await useCase.execute({
      id: 'exam-1',
      referenceObservations: 'Updated',
    });

    expect(mockExamRepository.update).toHaveBeenCalled();
    expect(mockAuditLogRepository.create).toHaveBeenCalledWith(
      expect.objectContaining({ action: 'UPDATE', entityName: 'EXAM' })
    );
    expect(result).toEqual(updated);
  });

  it('should throw ValidationError on invalid input', async () => {
    const {
      examSchema,
    } = require('@/core/application/validation/schemas/exam.schema');
    examSchema.partial.mockReturnValueOnce({
      safeParse: jest.fn(() => ({ success: false, error: { issues: [] } })),
    });

    await expect(useCase.execute({ id: 'exam-1' } as any)).rejects.toThrow(
      ValidationError
    );
  });

  it('should throw NotFoundError when exam does not exist', async () => {
    const {
      examSchema,
    } = require('@/core/application/validation/schemas/exam.schema');
    examSchema.partial.mockReturnValueOnce({
      safeParse: jest.fn(() => ({ success: true, data: {} })),
    });
    mockExamRepository.findById.mockResolvedValueOnce(null);

    await expect(useCase.execute({ id: 'exam-1' } as any)).rejects.toThrow(
      NotFoundError
    );
  });
});
