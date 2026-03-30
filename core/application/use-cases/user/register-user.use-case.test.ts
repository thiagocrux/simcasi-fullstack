/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-require-imports */
jest.mock('@/core/infrastructure/lib/request-context', () => ({
  getRequestContext: jest.fn(() => ({
    userId: 'ctx-user-id',
    ipAddress: '127.0.0.1',
    userAgent: 'Jest',
  })),
}));

jest.mock('@/core/application/validation/schemas/user.schema', () => ({
  userSchema: {
    safeParse: jest.fn((data: any) => ({ success: true, data })),
  },
}));

jest.mock('@/core/application/validation/zod.utils', () => ({
  formatZodError: jest.fn(() => ({})),
}));

import {
  ConflictError,
  NotFoundError,
  ValidationError,
} from '@/core/domain/errors/app.error';
import { RegisterUserUseCase } from './register-user.use-case';

const mockUserRepository = {
  findByEmail: jest.fn(),
  findByCpf: jest.fn(),
  findByEnrollmentNumber: jest.fn(),
  findByProfessionalRegistration: jest.fn(),
  create: jest.fn(),
};
const mockRoleRepository = { findById: jest.fn() };
const mockHashProvider = { hash: jest.fn() };
const mockAuditLogRepository = { create: jest.fn() };

describe('RegisterUserUseCase', () => {
  let useCase: RegisterUserUseCase;

  const validInput = {
    name: 'User',
    email: 'a@b.com',
    phone: '(11) 91234-5678',
    enrollmentNumber: 'MAT-000001',
    professionalRegistration: 'CRM-000001',
    cpf: '529.982.247-25',
    workplace: 'Hospital Test',
    password: 'pass',
    roleId: 'r1',
  };

  beforeEach(() => {
    jest.clearAllMocks();
    useCase = new RegisterUserUseCase(
      mockUserRepository as any,
      mockRoleRepository as any,
      mockHashProvider as any,
      mockAuditLogRepository as any
    );
  });

  it('should register a new user', async () => {
    const {
      userSchema,
    } = require('@/core/application/validation/schemas/user.schema');
    userSchema.safeParse.mockReturnValueOnce({
      success: true,
      data: validInput,
    });
    mockRoleRepository.findById.mockResolvedValueOnce({ id: 'r1' });
    mockUserRepository.findByEmail.mockResolvedValueOnce(null);
    mockUserRepository.findByCpf.mockResolvedValueOnce(null);
    mockUserRepository.findByEnrollmentNumber.mockResolvedValueOnce(null);
    mockUserRepository.findByProfessionalRegistration.mockResolvedValueOnce(
      null
    );
    mockHashProvider.hash.mockResolvedValueOnce('hashed-pw');
    const created = { id: 'u1', ...validInput, password: 'hashed-pw' };
    mockUserRepository.create.mockResolvedValueOnce(created);

    const result = await useCase.execute(validInput);

    expect(mockHashProvider.hash).toHaveBeenCalledWith('pass');
    expect(result).not.toHaveProperty('password');
    expect(mockAuditLogRepository.create).toHaveBeenCalledWith(
      expect.objectContaining({ action: 'CREATE', entityName: 'USER' })
    );
  });

  it('should throw NotFoundError when role not found', async () => {
    const {
      userSchema,
    } = require('@/core/application/validation/schemas/user.schema');
    userSchema.safeParse.mockReturnValueOnce({
      success: true,
      data: validInput,
    });
    mockRoleRepository.findById.mockResolvedValueOnce(null);

    await expect(useCase.execute(validInput)).rejects.toThrow(NotFoundError);
  });

  it('should throw ConflictError when email exists', async () => {
    const {
      userSchema,
    } = require('@/core/application/validation/schemas/user.schema');
    userSchema.safeParse.mockReturnValueOnce({
      success: true,
      data: validInput,
    });
    mockRoleRepository.findById.mockResolvedValueOnce({ id: 'r1' });
    mockUserRepository.findByEmail.mockResolvedValueOnce({ id: 'existing' });

    await expect(useCase.execute(validInput)).rejects.toThrow(ConflictError);
  });

  it('should throw ConflictError when CPF exists', async () => {
    const {
      userSchema,
    } = require('@/core/application/validation/schemas/user.schema');
    userSchema.safeParse.mockReturnValueOnce({
      success: true,
      data: validInput,
    });
    mockRoleRepository.findById.mockResolvedValueOnce({ id: 'r1' });
    mockUserRepository.findByEmail.mockResolvedValueOnce(null);
    mockUserRepository.findByCpf.mockResolvedValueOnce({ id: 'existing' });

    await expect(useCase.execute(validInput)).rejects.toThrow(ConflictError);
  });

  it('should throw ConflictError when enrollment number exists', async () => {
    const {
      userSchema,
    } = require('@/core/application/validation/schemas/user.schema');
    userSchema.safeParse.mockReturnValueOnce({
      success: true,
      data: validInput,
    });
    mockRoleRepository.findById.mockResolvedValueOnce({ id: 'r1' });
    mockUserRepository.findByEmail.mockResolvedValueOnce(null);
    mockUserRepository.findByCpf.mockResolvedValueOnce(null);
    mockUserRepository.findByEnrollmentNumber.mockResolvedValueOnce({
      id: 'existing',
    });

    await expect(useCase.execute(validInput)).rejects.toThrow(ConflictError);
  });

  it('should throw ConflictError when professional registration exists', async () => {
    const {
      userSchema,
    } = require('@/core/application/validation/schemas/user.schema');
    userSchema.safeParse.mockReturnValueOnce({
      success: true,
      data: validInput,
    });
    mockRoleRepository.findById.mockResolvedValueOnce({ id: 'r1' });
    mockUserRepository.findByEmail.mockResolvedValueOnce(null);
    mockUserRepository.findByCpf.mockResolvedValueOnce(null);
    mockUserRepository.findByEnrollmentNumber.mockResolvedValueOnce(null);
    mockUserRepository.findByProfessionalRegistration.mockResolvedValueOnce({
      id: 'existing',
    });

    await expect(useCase.execute(validInput)).rejects.toThrow(ConflictError);
  });

  it('should throw ValidationError on invalid input', async () => {
    const {
      userSchema,
    } = require('@/core/application/validation/schemas/user.schema');
    userSchema.safeParse.mockReturnValueOnce({ success: false, error: {} });

    await expect(useCase.execute({} as any)).rejects.toThrow(ValidationError);
  });
});
