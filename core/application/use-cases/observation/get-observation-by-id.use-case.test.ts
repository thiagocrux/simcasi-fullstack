/* eslint-disable @typescript-eslint/no-explicit-any */
import { NotFoundError } from '@/core/domain/errors/app.error';
import { GetObservationByIdUseCase } from './get-observation-by-id.use-case';

const mockObservationRepository = { findById: jest.fn() };

describe('GetObservationByIdUseCase', () => {
  let useCase: GetObservationByIdUseCase;

  beforeEach(() => {
    jest.clearAllMocks();
    useCase = new GetObservationByIdUseCase(mockObservationRepository as any);
  });

  it('should return the observation when found', async () => {
    const obs = { id: 'obs-1' };
    mockObservationRepository.findById.mockResolvedValueOnce(obs);
    expect(await useCase.execute({ id: 'obs-1' })).toEqual(obs);
  });

  it('should throw NotFoundError when not found', async () => {
    mockObservationRepository.findById.mockResolvedValueOnce(null);
    await expect(useCase.execute({ id: 'x' })).rejects.toThrow(NotFoundError);
  });
});
