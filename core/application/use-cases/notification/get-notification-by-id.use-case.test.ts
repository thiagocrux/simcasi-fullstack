/* eslint-disable @typescript-eslint/no-explicit-any */
import { NotFoundError } from '@/core/domain/errors/app.error';
import { GetNotificationByIdUseCase } from './get-notification-by-id.use-case';

const mockNotificationRepository = { findById: jest.fn() };

describe('GetNotificationByIdUseCase', () => {
  let useCase: GetNotificationByIdUseCase;

  beforeEach(() => {
    jest.clearAllMocks();
    useCase = new GetNotificationByIdUseCase(mockNotificationRepository as any);
  });

  it('should return the notification when found', async () => {
    const notif = { id: 'notif-1', sinan: '123' };
    mockNotificationRepository.findById.mockResolvedValueOnce(notif);

    const result = await useCase.execute({ id: 'notif-1' });
    expect(result).toEqual(notif);
  });

  it('should throw NotFoundError when not found', async () => {
    mockNotificationRepository.findById.mockResolvedValueOnce(null);
    await expect(useCase.execute({ id: 'x' })).rejects.toThrow(NotFoundError);
  });
});
