/* eslint-disable @typescript-eslint/no-explicit-any */
import { NotFoundError } from '@/core/domain/errors/app.error';
import { GetAuditLogByIdUseCase } from './get-audit-log-by-id.use-case';

const mockAuditLogRepository = {
  findById: jest.fn(),
  findAll: jest.fn(),
  create: jest.fn(),
};

describe('GetAuditLogByIdUseCase', () => {
  let useCase: GetAuditLogByIdUseCase;

  beforeEach(() => {
    jest.clearAllMocks();
    useCase = new GetAuditLogByIdUseCase(mockAuditLogRepository as any);
  });

  it('should return the audit log when found', async () => {
    const auditLog = { id: 'log-1', action: 'CREATE', entityName: 'PATIENT' };
    mockAuditLogRepository.findById.mockResolvedValueOnce(auditLog);

    const result = await useCase.execute({ id: 'log-1' });

    expect(mockAuditLogRepository.findById).toHaveBeenCalledWith('log-1');
    expect(result).toEqual(auditLog);
  });

  it('should throw NotFoundError when audit log does not exist', async () => {
    mockAuditLogRepository.findById.mockResolvedValueOnce(null);

    await expect(useCase.execute({ id: 'missing-id' })).rejects.toThrow(
      NotFoundError
    );
  });
});
