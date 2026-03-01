import { FindAuditLogsUseCase } from '@/core/application/use-cases/audit-log/find-audit-logs.use-case';
import { GetAuditLogByIdUseCase } from '@/core/application/use-cases/audit-log/get-audit-log-by-id.use-case';
import { RegisterAuditLogUseCase } from '@/core/application/use-cases/audit-log/register-audit-log.use-case';
import {
  makeFindAuditLogsUseCase,
  makeGetAuditLogByIdUseCase,
  makeRegisterAuditLogUseCase,
} from './audit-log.factory';

describe('audit-log.factory', () => {
  describe('makeFindAuditLogsUseCase', () => {
    it('should return an instance of FindAuditLogsUseCase', () => {
      const useCase = makeFindAuditLogsUseCase();
      expect(useCase).toBeInstanceOf(FindAuditLogsUseCase);
    });

    it('should have execute method', () => {
      const useCase = makeFindAuditLogsUseCase();
      expect(useCase.execute).toBeDefined();
      expect(typeof useCase.execute).toBe('function');
    });

    it('should return a new instance each time it is called', () => {
      const useCase1 = makeFindAuditLogsUseCase();
      const useCase2 = makeFindAuditLogsUseCase();
      expect(useCase1).not.toBe(useCase2);
    });
  });

  describe('makeGetAuditLogByIdUseCase', () => {
    it('should return an instance of GetAuditLogByIdUseCase', () => {
      const useCase = makeGetAuditLogByIdUseCase();
      expect(useCase).toBeInstanceOf(GetAuditLogByIdUseCase);
    });

    it('should have execute method', () => {
      const useCase = makeGetAuditLogByIdUseCase();
      expect(useCase.execute).toBeDefined();
      expect(typeof useCase.execute).toBe('function');
    });

    it('should return a new instance each time it is called', () => {
      const useCase1 = makeGetAuditLogByIdUseCase();
      const useCase2 = makeGetAuditLogByIdUseCase();
      expect(useCase1).not.toBe(useCase2);
    });
  });

  describe('makeRegisterAuditLogUseCase', () => {
    it('should return an instance of RegisterAuditLogUseCase', () => {
      const useCase = makeRegisterAuditLogUseCase();
      expect(useCase).toBeInstanceOf(RegisterAuditLogUseCase);
    });

    it('should have execute method', () => {
      const useCase = makeRegisterAuditLogUseCase();
      expect(useCase.execute).toBeDefined();
      expect(typeof useCase.execute).toBe('function');
    });

    it('should return a new instance each time it is called', () => {
      const useCase1 = makeRegisterAuditLogUseCase();
      const useCase2 = makeRegisterAuditLogUseCase();
      expect(useCase1).not.toBe(useCase2);
    });
  });
});
