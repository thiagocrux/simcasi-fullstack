export const mockApiCall = (
  success: boolean = true,
  data?: unknown,
  delay: number = 2000
) => {
  return new Promise((resolve, reject) => {
    const defaultData = {
      success: true,
      data: null,
      errors: {} as Record<string, string[]>,
    };

    setTimeout(() => {
      // Simulates a success case
      if (success) {
        resolve(data ?? defaultData);
        return;
      }

      // Simulates an error
      reject(new Error('MockApiCall'));
    }, delay);
  });
};

export const mockPatients = [
  {
    id: '550e8400-e29b-41d4-a716-446655440000',
    susCardNumber: '123456789012345',
    name: 'João da Silva',
    cpf: '123.456.789-00',
    socialName: 'Joãozinho',
    birthDate: new Date('1990-01-01'),
    race: 'Parda',
    sex: 'Masculino',
    gender: 'Homem cis',
    sexuality: 'Heterossexual',
    nationality: 'Brasileira',
    schooling: 'Ensino superior completo',
    phone: '(11) 91234-5678',
    email: 'joao@email.com',
    motherName: 'Maria da Silva',
    fatherName: 'José da Silva',
    isDeceased: false,
    monitoringType: 'Ambulatorial',
    zipCode: '01234-567',
    state: 'SP',
    city: 'São Paulo',
    neighborhood: 'Centro',
    street: 'Rua das Flores',
    houseNumber: '123',
    complement: 'Apto 45',
    createdBy: 'b9c0d1e2-f3a4-4b5c-6d7e-8f9a0b1c2d3e',
    createdAt: new Date(),
    updatedAt: new Date(),
    deletedAt: null,
  },
  {
    id: '6ba7b810-9dad-11d1-80b4-00c04fd430c8',
    susCardNumber: '987654321098765',
    name: 'Maria Oliveira',
    cpf: '987.654.321-00',
    socialName: null,
    birthDate: new Date('1985-05-15'),
    race: 'Branca',
    sex: 'Feminino',
    gender: 'Mulher cis',
    sexuality: 'Heterossexual',
    nationality: 'Brasileira',
    schooling: 'Ensino médio completo',
    phone: '(21) 99876-5432',
    email: 'maria@email.com',
    motherName: 'Ana Oliveira',
    fatherName: null,
    isDeceased: false,
    monitoringType: 'Hospitalar',
    zipCode: '20000-000',
    state: 'RJ',
    city: 'Rio de Janeiro',
    neighborhood: 'Copacabana',
    street: 'Av. Atlântica',
    houseNumber: '456',
    complement: null,
    createdBy: 'c0d1e2f3-a4b5-4c6d-7e8f-9a0b1c2d3e4f',
    createdAt: new Date(),
    updatedAt: new Date(),
    deletedAt: null,
  },
];

export const mockRoles = [
  {
    id: 'd5e6f7a8-b9c0-4d1e-2f3a-4b5c6d7e8f9a',
    code: 'ADMIN',
    createdAt: new Date(),
    updatedAt: new Date(),
    deletedAt: null,
  },
  {
    id: 'e6f7a8b9-c0d1-4e2f-3a4b-5c6d7e8f9a0b',
    code: 'USER',
    createdAt: new Date(),
    updatedAt: new Date(),
    deletedAt: null,
  },
];

export const mockPermissions = [
  {
    id: 'f7a8b9c0-d1e2-4f3a-4b5c-6d7e8f9a0b1c',
    code: 'READ_PATIENT',
    createdAt: new Date(),
    updatedAt: new Date(),
    deletedAt: null,
  },
  {
    id: 'a8b9c0d1-e2f3-4a4b-5c6d-7e8f9a0b1c2d',
    code: 'WRITE_PATIENT',
    createdAt: new Date(),
    updatedAt: new Date(),
    deletedAt: null,
  },
];

export const mockRolePermissions = [
  {
    roleId: 'd5e6f7a8-b9c0-4d1e-2f3a-4b5c6d7e8f9a',
    permissionId: 'f7a8b9c0-d1e2-4f3a-4b5c-6d7e8f9a0b1c',
  },
  {
    roleId: 'd5e6f7a8-b9c0-4d1e-2f3a-4b5c6d7e8f9a',
    permissionId: 'a8b9c0d1-e2f3-4a4b-5c6d-7e8f9a0b1c2d',
  },
  {
    roleId: 'e6f7a8b9-c0d1-4e2f-3a4b-5c6d7e8f9a0b',
    permissionId: 'f7a8b9c0-d1e2-4f3a-4b5c-6d7e8f9a0b1c',
  },
];

export const mockUsers = [
  {
    id: 'b9c0d1e2-f3a4-4b5c-6d7e-8f9a0b1c2d3e',
    name: 'Admin User',
    email: 'admin@simcasi.com',
    password: 'hashed_password_123',
    roleId: 'd5e6f7a8-b9c0-4d1e-2f3a-4b5c6d7e8f9a',
    createdAt: new Date(),
    updatedAt: new Date(),
    deletedAt: null,
  },
  {
    id: 'c0d1e2f3-a4b5-4c6d-7e8f-9a0b1c2d3e4f',
    name: 'Regular User',
    email: 'user@simcasi.com',
    password: 'hashed_password_456',
    roleId: 'e6f7a8b9-c0d1-4e2f-3a4b-5c6d7e8f9a0b',
    createdAt: new Date(),
    updatedAt: new Date(),
    deletedAt: null,
  },
];

export const mockSessions = [
  {
    id: 'd1e2f3a4-b5c6-4d7e-8f9a-0b1c2d3e4f5a',
    userId: 'b9c0d1e2-f3a4-4b5c-6d7e-8f9a0b1c2d3e',
    issuedAt: new Date(),
    expiresAt: new Date(Date.now() + 3600 * 1000), // 1 hour later
    ipAddress: '127.0.0.1',
    userAgent: 'Mozilla/5.0 ...',
    createdAt: new Date(),
    updatedAt: new Date(),
    deletedAt: null,
  },
];

export const mockExams = [
  {
    id: 'e2f3a4b5-c6d7-4e8f-9a0b-1c2d3e4f5a6b',
    patientId: '550e8400-e29b-41d4-a716-446655440000',
    treponemalTestType: 'Teste Rápido',
    treponemalTestResult: 'Reagente',
    treponemalTestDate: new Date('2023-01-10'),
    treponemalTestLocation: 'UBS Centro',
    nontreponemalVdrlTest: 'Reagente',
    nontreponemalTestTitration: '1:8',
    nontreponemalTestDate: new Date('2023-01-12'),
    otherNontreponemalTest: null,
    otherNontreponemalTestDate: null,
    referenceObservations: 'Paciente encaminhado para tratamento.',
    createdBy: 'b9c0d1e2-f3a4-4b5c-6d7e-8f9a0b1c2d3e',
    createdAt: new Date(),
    updatedAt: new Date(),
    deletedAt: null,
  },
  {
    id: 'f3a4b5c6-d7e8-4f9a-0b1c-2d3e4f5a6b7c',
    patientId: '6ba7b810-9dad-11d1-80b4-00c04fd430c8',
    treponemalTestType: 'FTA-Abs',
    treponemalTestResult: 'Não Reagente',
    treponemalTestDate: new Date('2023-02-20'),
    treponemalTestLocation: 'Hospital Geral',
    nontreponemalVdrlTest: 'Não Reagente',
    nontreponemalTestTitration: 'NR',
    nontreponemalTestDate: new Date('2023-02-20'),
    otherNontreponemalTest: null,
    otherNontreponemalTestDate: null,
    referenceObservations: 'Sem observações.',
    createdBy: 'c0d1e2f3-a4b5-4c6d-7e8f-9a0b1c2d3e4f',
    createdAt: new Date(),
    updatedAt: new Date(),
    deletedAt: null,
  },
];

export const mockNotifications = [
  {
    id: 'a4b5c6d7-e8f9-4a0b-1c2d-3e4f5a6b7c8d',
    patientId: '550e8400-e29b-41d4-a716-446655440000',
    sinan: '123456',
    observations: 'Notificação compulsória realizada.',
    createdBy: 'b9c0d1e2-f3a4-4b5c-6d7e-8f9a0b1c2d3e',
    createdAt: new Date(),
    updatedAt: new Date(),
    deletedAt: null,
  },
];

export const mockObservations = [
  {
    id: 'b5c6d7e8-f9a0-4b1c-2d3e-4f5a6b7c8d9e',
    patientId: '550e8400-e29b-41d4-a716-446655440000',
    observations: 'Paciente relatou alergia a penicilina (verificar).',
    hasPartnerBeingTreated: true,
    createdBy: 'b9c0d1e2-f3a4-4b5c-6d7e-8f9a0b1c2d3e',
    createdAt: new Date(),
    updatedAt: new Date(),
    deletedAt: null,
  },
];

export const mockTreatments = [
  {
    id: 'c6d7e8f9-a0b1-4c2d-3e4f-5a6b7c8d9e0f',
    patientId: '550e8400-e29b-41d4-a716-446655440000',
    medication: 'Benzetacil',
    healthCenter: 'UBS Centro',
    startDate: new Date('2023-01-15'),
    dosage: '2.400.000 UI',
    observations: 'Dose única.',
    partnerInformation: 'Parceiro tratado na mesma data.',
    createdBy: 'b9c0d1e2-f3a4-4b5c-6d7e-8f9a0b1c2d3e',
    createdAt: new Date(),
    updatedAt: new Date(),
    deletedAt: null,
  },
];

export const mockAuditLogs = [
  {
    id: 'd7e8f9a0-b1c2-4d3e-4f5a-6b7c8d9e0f1a',
    userId: 'b9c0d1e2-f3a4-4b5c-6d7e-8f9a0b1c2d3e',
    action: 'CREATE',
    entityName: 'Patient',
    entityId: '550e8400-e29b-41d4-a716-446655440000',
    oldValues: null,
    newValues: JSON.stringify({ name: 'João da Silva' }),
    ipAddress: '127.0.0.1',
    userAgent: 'Mozilla/5.0',
    createdAt: new Date(),
  },
];
