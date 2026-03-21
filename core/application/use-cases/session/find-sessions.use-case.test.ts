/* eslint-disable @typescript-eslint/no-explicit-any */
jest.mock('@/core/application/validation/schemas/session.schema', () => ({
  sessionQuerySchema: {
    parse: jest.fn((input: any) => ({ skip: 0, take: 10, ...input })),
  },
}));

import { FindSessionsUseCase } from './find-sessions.use-case';

const mockSessionRepository = { findAll: jest.fn() };
const mockUserRepository = { findByIds: jest.fn() };

describe('FindSessionsUseCase', () => {
  let useCase: FindSessionsUseCase;

  beforeEach(() => {
    jest.clearAllMocks();
    useCase = new FindSessionsUseCase(
      mockSessionRepository as any,
      mockUserRepository as any
    );
  });

  it('should return paginated sessions', async () => {
    mockSessionRepository.findAll.mockResolvedValueOnce({
      items: [],
      total: 0,
    });
    const result = await useCase.execute({});
    expect(result).toEqual({ items: [], total: 0 });
  });

  it('should map session fields properly', async () => {
    const now = new Date();
    const items = [
      {
        id: 's1',
        userId: 'u1',
        ipAddress: '1.2.3.4',
        userAgent: 'Chrome',
        issuedAt: now,
        expiresAt: now,
        createdAt: now,
        updatedAt: null,
        deletedAt: null,
        extraField: 'should be excluded',
      },
    ];
    mockSessionRepository.findAll.mockResolvedValueOnce({ items, total: 1 });

    const result = await useCase.execute({});

    expect(result.items[0]).toEqual({
      id: 's1',
      userId: 'u1',
      ipAddress: '1.2.3.4',
      userAgent: 'Chrome',
      issuedAt: now,
      expiresAt: now,
      createdAt: now,
      updatedAt: null,
      deletedAt: null,
    });
    expect((result.items[0] as any).extraField).toBeUndefined();
  });

  it('should enrich with related users when requested', async () => {
    const items = [
      {
        id: 's1',
        userId: 'u1',
        ipAddress: '1.2.3.4',
        userAgent: 'Chrome',
        issuedAt: new Date(),
        expiresAt: new Date(),
        deletedAt: null,
      },
    ];
    mockSessionRepository.findAll.mockResolvedValueOnce({ items, total: 1 });
    mockUserRepository.findByIds.mockResolvedValueOnce([
      { id: 'u1', name: 'User', password: 'p' },
    ]);

    const result = await useCase.execute({ includeRelatedUsers: true } as any);

    expect(result.relatedUsers).toEqual([{ id: 'u1', name: 'User' }]);
  });
});
