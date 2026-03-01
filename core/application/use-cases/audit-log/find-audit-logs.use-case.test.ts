/* eslint-disable @typescript-eslint/no-explicit-any */
jest.mock('@/core/application/validation/schemas/audit-log.schema', () => ({
  auditLogQuerySchema: {
    parse: jest.fn((input: any) => ({
      skip: 0,
      take: 10,
      ...input,
    })),
  },
}));

jest.mock('@/core/domain/constants/audit-log.constants', () => ({
  ACTION_LABELS: { CREATE: 'Criação', DELETE: 'Exclusão' },
  ENTITY_LABELS: { PATIENT: 'Paciente', EXAM: 'Exame' },
}));

jest.mock('@/lib/shared.utils', () => ({
  normalizeString: (s: string) =>
    s
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, ''),
}));

import { FindAuditLogsUseCase } from './find-audit-logs.use-case';

const mockAuditLogRepository = {
  findAll: jest.fn(),
  findById: jest.fn(),
  create: jest.fn(),
};

const mockUserRepository = {
  findByIds: jest.fn(),
};

describe('FindAuditLogsUseCase', () => {
  let useCase: FindAuditLogsUseCase;

  beforeEach(() => {
    jest.clearAllMocks();
    useCase = new FindAuditLogsUseCase(
      mockAuditLogRepository as any,
      mockUserRepository as any
    );
  });

  it('should return paginated audit logs', async () => {
    const items = [{ id: 'log-1', userId: 'user-1', action: 'CREATE' }];
    mockAuditLogRepository.findAll.mockResolvedValueOnce({ items, total: 1 });

    const result = await useCase.execute({});

    expect(mockAuditLogRepository.findAll).toHaveBeenCalled();
    expect(result).toEqual({ items, total: 1 });
  });

  it('should map localized action labels to enum values', async () => {
    mockAuditLogRepository.findAll.mockResolvedValueOnce({
      items: [],
      total: 0,
    });

    await useCase.execute({ search: 'Criação' } as any);

    expect(mockAuditLogRepository.findAll).toHaveBeenCalledWith(
      expect.objectContaining({ search: 'CREATE' })
    );
  });

  it('should map localized entity labels to enum values', async () => {
    mockAuditLogRepository.findAll.mockResolvedValueOnce({
      items: [],
      total: 0,
    });

    await useCase.execute({
      search: 'Paciente',
      searchBy: 'entityName',
    } as any);

    expect(mockAuditLogRepository.findAll).toHaveBeenCalledWith(
      expect.objectContaining({ search: 'PATIENT' })
    );
  });

  it('should fetch related users when includeRelatedUsers is true', async () => {
    const items = [
      { id: 'log-1', userId: 'user-1' },
      { id: 'log-2', userId: 'user-2' },
    ];
    mockAuditLogRepository.findAll.mockResolvedValueOnce({ items, total: 2 });
    mockUserRepository.findByIds.mockResolvedValueOnce([
      { id: 'user-1', name: 'User A', password: 'hash1' },
      { id: 'user-2', name: 'User B', password: 'hash2' },
    ]);

    const result = await useCase.execute({ includeRelatedUsers: true } as any);

    expect(mockUserRepository.findByIds).toHaveBeenCalledWith([
      'user-1',
      'user-2',
    ]);
    expect(result.relatedUsers).toEqual([
      { id: 'user-1', name: 'User A' },
      { id: 'user-2', name: 'User B' },
    ]);
  });

  it('should not fetch related users when includeRelatedUsers is false', async () => {
    mockAuditLogRepository.findAll.mockResolvedValueOnce({
      items: [],
      total: 0,
    });

    await useCase.execute({ includeRelatedUsers: false } as any);

    expect(mockUserRepository.findByIds).not.toHaveBeenCalled();
  });
});
