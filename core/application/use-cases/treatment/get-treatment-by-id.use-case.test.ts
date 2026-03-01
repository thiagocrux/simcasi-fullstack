/* eslint-disable @typescript-eslint/no-explicit-any */
import { NotFoundError } from '@/core/domain/errors/app.error';
import { GetTreatmentByIdUseCase } from './get-treatment-by-id.use-case';

const mockTreatmentRepository = { findById: jest.fn() };

describe('GetTreatmentByIdUseCase', () => {
  let useCase: GetTreatmentByIdUseCase;

  beforeEach(() => {
    jest.clearAllMocks();
    useCase = new GetTreatmentByIdUseCase(mockTreatmentRepository as any);
  });

  it('should return the treatment when found', async () => {
    const treatment = { id: 'treat-1' };
    mockTreatmentRepository.findById.mockResolvedValueOnce(treatment);
    expect(await useCase.execute({ id: 'treat-1' })).toEqual(treatment);
  });

  it('should throw NotFoundError when not found', async () => {
    mockTreatmentRepository.findById.mockResolvedValueOnce(null);
    await expect(useCase.execute({ id: 'x' })).rejects.toThrow(NotFoundError);
  });
});
