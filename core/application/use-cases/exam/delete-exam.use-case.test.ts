/* eslint-disable @typescript-eslint/no-explicit-any */
jest.mock('@/core/infrastructure/lib/request-context', () => ({
  getRequestContext: jest.fn(() => ({
    userId: 'ctx-user-id',
    ipAddress: '127.0.0.1',
    userAgent: 'Jest',
  })),
}));

import { NotFoundError } from '@/core/domain/errors/app.error';
import { DeleteExamUseCase } from './delete-exam.use-case';

const mockExamRepository = { findById: jest.fn(), softDelete: jest.fn() };
const mockAuditLogRepository = { create: jest.fn() };

describe('DeleteExamUseCase', () => {
  let useCase: DeleteExamUseCase;

  beforeEach(() => {
    jest.clearAllMocks();
    useCase = new DeleteExamUseCase(
      mockExamRepository as any,
      mockAuditLogRepository as any
    );
  });

  it('should soft delete the exam and create audit log', async () => {
    const existing = { id: 'exam-1', patientId: 'p1' };
    mockExamRepository.findById.mockResolvedValueOnce(existing);

    await useCase.execute({ id: 'exam-1' });

    expect(mockExamRepository.softDelete).toHaveBeenCalledWith(
      'exam-1',
      'ctx-user-id'
    );
    expect(mockAuditLogRepository.create).toHaveBeenCalledWith(
      expect.objectContaining({
        action: 'DELETE',
        entityName: 'EXAM',
        entityId: 'exam-1',
      })
    );
  });

  it('should throw NotFoundError when exam does not exist', async () => {
    mockExamRepository.findById.mockResolvedValueOnce(null);

    await expect(useCase.execute({ id: 'missing' })).rejects.toThrow(
      NotFoundError
    );
  });
});
