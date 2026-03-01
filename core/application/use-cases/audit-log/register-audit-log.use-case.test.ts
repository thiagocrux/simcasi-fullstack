/* eslint-disable @typescript-eslint/no-explicit-any */
import { RegisterAuditLogUseCase } from './register-audit-log.use-case';

const mockAuditLogRepository = {
  create: jest.fn(),
  findById: jest.fn(),
  findAll: jest.fn(),
};

describe('RegisterAuditLogUseCase', () => {
  let useCase: RegisterAuditLogUseCase;

  beforeEach(() => {
    jest.clearAllMocks();
    useCase = new RegisterAuditLogUseCase(mockAuditLogRepository as any);
  });

  it('should create an audit log with serialized oldValues and newValues', async () => {
    const input = {
      userId: 'user-1',
      action: 'CREATE' as const,
      entityName: 'PATIENT' as const,
      entityId: 'patient-1',
      oldValues: { name: 'Old Name' },
      newValues: { name: 'New Name' },
      ipAddress: '127.0.0.1',
      userAgent: 'Jest',
    };
    const created = { id: 'log-1', ...input };
    mockAuditLogRepository.create.mockResolvedValueOnce(created);

    const result = await useCase.execute(input);

    expect(mockAuditLogRepository.create).toHaveBeenCalledWith(
      expect.objectContaining({
        userId: 'user-1',
        action: 'CREATE',
        entityName: 'PATIENT',
        entityId: 'patient-1',
        oldValues: { name: 'Old Name' },
        newValues: { name: 'New Name' },
      })
    );
    expect(result).toEqual(created);
  });

  it('should handle undefined oldValues and newValues', async () => {
    const input = {
      userId: 'user-1',
      action: 'DELETE' as const,
      entityName: 'EXAM' as const,
      entityId: 'exam-1',
    };
    mockAuditLogRepository.create.mockResolvedValueOnce({
      id: 'log-2',
      ...input,
    });

    await useCase.execute(input);

    expect(mockAuditLogRepository.create).toHaveBeenCalledWith(
      expect.objectContaining({
        oldValues: undefined,
        newValues: undefined,
      })
    );
  });
});
