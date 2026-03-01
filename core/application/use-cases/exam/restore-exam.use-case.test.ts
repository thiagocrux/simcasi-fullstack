/* eslint-disable @typescript-eslint/no-explicit-any */
jest.mock('@/core/infrastructure/lib/request-context', () => ({
  getRequestContext: jest.fn(() => ({
    userId: 'ctx-user-id',
    ipAddress: '127.0.0.1',
    userAgent: 'Jest',
  })),
}));

import { NotFoundError } from '@/core/domain/errors/app.error';
import { RestoreExamUseCase } from './restore-exam.use-case';

const mockExamRepository = { findById: jest.fn(), restore: jest.fn() };
const mockAuditLogRepository = { create: jest.fn() };

describe('RestoreExamUseCase', () => {
  let useCase: RestoreExamUseCase;

  beforeEach(() => {
    jest.clearAllMocks();
    useCase = new RestoreExamUseCase(
      mockExamRepository as any,
      mockAuditLogRepository as any
    );
  });

  it('should restore a soft-deleted exam and create audit log', async () => {
    const existing = {
      id: 'exam-1',
      deletedAt: new Date(),
      updatedBy: null,
    };
    mockExamRepository.findById.mockResolvedValueOnce(existing);

    const result = await useCase.execute({ id: 'exam-1' });

    expect(mockExamRepository.restore).toHaveBeenCalledWith(
      'exam-1',
      'ctx-user-id'
    );
    expect(mockAuditLogRepository.create).toHaveBeenCalledWith(
      expect.objectContaining({
        action: 'RESTORE',
        entityName: 'EXAM',
        entityId: 'exam-1',
      })
    );
    expect(result.deletedAt).toBeNull();
  });

  it('should return the exam without restoring if not deleted', async () => {
    const existing = { id: 'exam-1', deletedAt: null };
    mockExamRepository.findById.mockResolvedValueOnce(existing);

    const result = await useCase.execute({ id: 'exam-1' });

    expect(mockExamRepository.restore).not.toHaveBeenCalled();
    expect(mockAuditLogRepository.create).not.toHaveBeenCalled();
    expect(result).toEqual(existing);
  });

  it('should throw NotFoundError when exam does not exist', async () => {
    mockExamRepository.findById.mockResolvedValueOnce(null);

    await expect(useCase.execute({ id: 'missing' })).rejects.toThrow(
      NotFoundError
    );
  });
});
