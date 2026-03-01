/* eslint-disable @typescript-eslint/no-explicit-any */
jest.mock('@/core/application/validation/schemas/notification.schema', () => ({
  notificationQuerySchema: {
    parse: jest.fn((input: any) => ({ skip: 0, take: 10, ...input })),
  },
}));

import { FindNotificationsUseCase } from './find-notifications.use-case';

const mockNotificationRepository = { findAll: jest.fn() };
const mockUserRepository = { findByIds: jest.fn() };
const mockPatientRepository = { findByIds: jest.fn() };

describe('FindNotificationsUseCase', () => {
  let useCase: FindNotificationsUseCase;

  beforeEach(() => {
    jest.clearAllMocks();
    useCase = new FindNotificationsUseCase(
      mockNotificationRepository as any,
      mockUserRepository as any,
      mockPatientRepository as any
    );
  });

  it('should return paginated notifications', async () => {
    mockNotificationRepository.findAll.mockResolvedValueOnce({
      items: [],
      total: 0,
    });

    const result = await useCase.execute({});
    expect(result).toEqual({ items: [], total: 0 });
  });

  it('should enrich with related users and patients', async () => {
    const items = [{ id: 'n1', createdBy: 'u1', patientId: 'p1' }];
    mockNotificationRepository.findAll.mockResolvedValueOnce({
      items,
      total: 1,
    });
    mockUserRepository.findByIds.mockResolvedValueOnce([
      { id: 'u1', name: 'User', password: 'h' },
    ]);
    mockPatientRepository.findByIds.mockResolvedValueOnce([
      { id: 'p1', name: 'Patient' },
    ]);

    const result = await useCase.execute({
      includeRelatedUsers: true,
      includeRelatedPatients: true,
    } as any);

    expect(result.relatedUsers).toEqual([{ id: 'u1', name: 'User' }]);
    expect(result.relatedPatients).toEqual([{ id: 'p1', name: 'Patient' }]);
  });
});
