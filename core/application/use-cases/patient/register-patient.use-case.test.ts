/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-require-imports */
jest.mock('@/core/infrastructure/lib/request-context', () => ({
  getRequestContext: jest.fn(() => ({
    userId: 'ctx-user-id',
    ipAddress: '127.0.0.1',
    userAgent: 'Jest',
  })),
}));

jest.mock('@/core/application/validation/schemas/patient.schema', () => ({
  patientSchema: {
    safeParse: jest.fn((data: any) => ({ success: true, data })),
    partial: jest.fn(() => ({
      safeParse: jest.fn((data: any) => ({ success: true, data })),
    })),
  },
}));

jest.mock('@/core/application/validation/zod.utils', () => ({
  formatZodError: jest.fn(() => ({})),
}));

import { ConflictError, ValidationError } from '@/core/domain/errors/app.error';
import { RegisterPatientUseCase } from './register-patient.use-case';

const mockPatientRepository = {
  findByCpf: jest.fn(),
  findBySusCardNumber: jest.fn(),
  create: jest.fn(),
  update: jest.fn(),
};
const mockAuditLogRepository = { create: jest.fn() };

describe('RegisterPatientUseCase', () => {
  let useCase: RegisterPatientUseCase;

  const validInput = {
    cpf: '123.456.789-00',
    susCardNumber: '123 4567 8901 2345',
    name: 'John',
    birthDate: '2000-01-01',
    race: 'BRANCA',
    sex: 'M',
    gender: 'CIS',
    sexuality: 'HETEROSSEXUAL',
    nationality: 'BRASILEIRO',
    schooling: 'SUPERIOR',
    motherName: 'Jane',
    isDeceased: false,
    monitoringType: 'ACTIVE',
    state: 'SP',
    city: 'São Paulo',
    neighborhood: 'Centro',
    street: 'Rua A',
    houseNumber: '100',
  };

  beforeEach(() => {
    jest.clearAllMocks();
    useCase = new RegisterPatientUseCase(
      mockPatientRepository as any,
      mockAuditLogRepository as any
    );
  });

  it('should create a new patient when no duplicate exists', async () => {
    const {
      patientSchema,
    } = require('@/core/application/validation/schemas/patient.schema');
    patientSchema.safeParse.mockReturnValueOnce({
      success: true,
      data: validInput,
    });
    mockPatientRepository.findByCpf.mockResolvedValueOnce(null);
    mockPatientRepository.findBySusCardNumber.mockResolvedValueOnce(null);
    const created = { id: 'p1', ...validInput };
    mockPatientRepository.create.mockResolvedValueOnce(created);

    const result = await useCase.execute(validInput);

    expect(mockPatientRepository.create).toHaveBeenCalled();
    expect(mockAuditLogRepository.create).toHaveBeenCalledWith(
      expect.objectContaining({ action: 'CREATE', entityName: 'PATIENT' })
    );
    expect(result).toEqual(created);
  });

  it('should restore a soft-deleted patient with same CPF', async () => {
    const {
      patientSchema,
    } = require('@/core/application/validation/schemas/patient.schema');
    patientSchema.safeParse.mockReturnValueOnce({
      success: true,
      data: validInput,
    });
    mockPatientRepository.findByCpf.mockResolvedValueOnce({
      id: 'p-old',
      deletedAt: new Date(),
    });
    mockPatientRepository.findBySusCardNumber.mockResolvedValueOnce(null);
    const restored = { id: 'p-old', ...validInput, deletedAt: null };
    mockPatientRepository.update.mockResolvedValueOnce(restored);

    const result = await useCase.execute(validInput);

    expect(mockPatientRepository.update).toHaveBeenCalledWith(
      'p-old',
      expect.objectContaining({ deletedAt: null }),
      'ctx-user-id'
    );
    expect(mockAuditLogRepository.create).toHaveBeenCalledWith(
      expect.objectContaining({ action: 'RESTORE' })
    );
    expect(result).toEqual(restored);
  });

  it('should throw ConflictError when active patient with same CPF exists', async () => {
    const {
      patientSchema,
    } = require('@/core/application/validation/schemas/patient.schema');
    patientSchema.safeParse.mockReturnValueOnce({
      success: true,
      data: validInput,
    });
    mockPatientRepository.findByCpf.mockResolvedValueOnce({
      id: 'p-active',
      deletedAt: null,
    });

    await expect(useCase.execute(validInput)).rejects.toThrow(ConflictError);
  });

  it('should throw ConflictError when active patient with same SUS exists', async () => {
    const {
      patientSchema,
    } = require('@/core/application/validation/schemas/patient.schema');
    patientSchema.safeParse.mockReturnValueOnce({
      success: true,
      data: validInput,
    });
    mockPatientRepository.findByCpf.mockResolvedValueOnce(null);
    mockPatientRepository.findBySusCardNumber.mockResolvedValueOnce({
      id: 'p-active',
      deletedAt: null,
    });

    await expect(useCase.execute(validInput)).rejects.toThrow(ConflictError);
  });

  it('should throw ValidationError on invalid input', async () => {
    const {
      patientSchema,
    } = require('@/core/application/validation/schemas/patient.schema');
    patientSchema.safeParse.mockReturnValueOnce({ success: false, error: {} });

    await expect(useCase.execute({} as any)).rejects.toThrow(ValidationError);
  });
});
