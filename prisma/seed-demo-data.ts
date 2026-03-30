import { PrismaPg } from '@prisma/adapter-pg';
import type { Prisma } from '@prisma/client';
import { PrismaClient } from '@prisma/client';
import { hashSync } from 'bcryptjs';
import { Pool } from 'pg';

import {
  AUDIT_LOG_ACTION,
  AUDIT_LOG_ENTITY,
} from '@/core/domain/constants/audit-log.constants';
import { SECURITY_CONSTANTS } from '@/core/domain/constants/security.constants';
import { SYSTEM_CONSTANTS } from '@/core/domain/constants/system.constants';
import { env } from '@/core/infrastructure/lib/env.config';
import { logger } from '@/lib/logger.utils';

const connectionString = `${env.DATABASE_URL}`;
const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

// ─────────────────────────────────────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Temporal range for test data distribution across the last 7 months.
 * Used to ensure realistic date variance in seeded records.
 */
const SEED_START = new Date('2025-08-20T00:00:00Z');
const SEED_END = new Date('2026-03-20T23:59:59Z');

/**
 * Generates a random date between a given range.
 * @param start The start date of the range. Defaults to SEED_START.
 * @param end The end date of the range. Defaults to SEED_END.
 * @return A random date between start and end (inclusive).
 */
function randomDate(start: Date = SEED_START, end: Date = SEED_END): Date {
  const from = start.getTime();
  const to = end.getTime();
  if (from >= to) return new Date(from);
  return new Date(from + Math.random() * (to - from));
}

/**
 * Selects a random item from an array.
 * @param arr The array to select from.
 * @return A random element from the array.
 */
function randomItem<T>(arr: readonly T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

/**
 * Generates a random integer between min and max (inclusive).
 * @param min The minimum value.
 * @param max The maximum value.
 * @return A random integer between min and max.
 */
function randomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

/**
 * Generates a realistic CPF-like identifier for test patients.
 * @param index The patient index used to generate a unique CPF.
 * @return A formatted CPF string (XXX.XXX.XXX-XX).
 */
function generateCPF(index: number): string {
  const n = String(index + 1).padStart(9, '0');
  const d = String(((index + 1) * 3) % 100).padStart(2, '0');
  return `${n.slice(0, 3)}.${n.slice(3, 6)}.${n.slice(6, 9)}-${d}`;
}

/**
 * Generates a realistic SUS card number for test patients.
 * @param index The patient index used to generate a unique SUS card number.
 * @return A formatted SUS card number (14-15 digits).
 */
function generateSUSCard(index: number): string {
  return String(700000000000000 + index + 1);
}

// ─────────────────────────────────────────────────────────────────────────────
// Static Reference Data
// ─────────────────────────────────────────────────────────────────────────────
//
// Predefined datasets for realistic test data generation:
// - Demographics (race, sexuality, schooling, monitoring types)
// - Geography (states, cities, neighborhoods, streets)
// - Medical data (test types, results, medications, dosages, health centers)
// - Clinical notes (realistic observations for medical records)

const RACES = [
  'Branca',
  'Preta',
  'Parda',
  'Amarela',
  'Indígena',
  'Não declarado',
] as const;

const SEXUALITIES = [
  'Heterossexual',
  'Homossexual',
  'Bissexual',
  'Pansexual',
  'Não declarado',
] as const;

const SCHOOLINGS = [
  'Médio completo',
  'Superior incompleto',
  'Superior completo',
  'Fundamental completo',
  'Médio incompleto',
  'Pós-graduação',
] as const;

const MONITORING_TYPES = ['Caso', 'Contato'] as const;

const STATES = [
  'SP',
  'RJ',
  'MG',
  'BA',
  'RS',
  'PR',
  'PE',
  'CE',
  'GO',
  'DF',
] as const;

const CITY_BY_STATE: Record<(typeof STATES)[number], string> = {
  SP: 'São Paulo',
  RJ: 'Rio de Janeiro',
  MG: 'Belo Horizonte',
  BA: 'Salvador',
  RS: 'Porto Alegre',
  PR: 'Curitiba',
  PE: 'Recife',
  CE: 'Fortaleza',
  GO: 'Goiânia',
  DF: 'Brasília',
};

const NEIGHBORHOODS = [
  'Centro',
  'Jardim América',
  'Vila Nova',
  'Bela Vista',
  'Santa Cruz',
  'Boa Vista',
  'São Bento',
  'Nova Lima',
] as const;

const STREETS = [
  'Rua das Acácias',
  'Av. Brasil',
  'Rua Sete de Setembro',
  'Rua XV de Novembro',
  'Av. Paulista',
  'Rua 25 de Março',
  'Alameda Santos',
  'Av. Getúlio Vargas',
] as const;

const TREPONEMAL_TYPES = [
  'FTA-ABS',
  'TPHA',
  'EIA',
  'Treponema pallidum',
] as const;

const TREPONEMAL_RESULTS = [
  'Reagente',
  'Não reagente',
  'Indeterminado',
] as const;

const NON_TREPONEMAL_TESTS = ['VDRL', 'RPR'] as const;

const NON_TREPONEMAL_TITRATIONS = [
  '1:1',
  '1:2',
  '1:4',
  '1:8',
  '1:16',
  '1:32',
  'Não reagente',
] as const;

const MEDICATIONS = [
  'Penicilina G Benzatina',
  'Doxiciclina',
  'Azitromicina',
  'Ceftriaxona',
  'Penicilina G Cristalina',
  'Tetraciclina',
] as const;

const DOSAGES: Record<(typeof MEDICATIONS)[number], string> = {
  'Penicilina G Benzatina': '2,4 MUI IM dose única',
  Doxiciclina: '100mg VO 12/12h por 15 dias',
  Azitromicina: '500mg VO dose única',
  Ceftriaxona: '1g IM/IV por 10 dias',
  'Penicilina G Cristalina': '18-24 MUI/dia IV por 10-14 dias',
  Tetraciclina: '500mg VO 6/6h por 15 dias',
};

const HEALTH_CENTERS = [
  'UBS Centro',
  'UBS Vila Nova',
  'UPA 24h Sul',
  'Hospital Municipal',
  'Ambulatório DST/IST',
  'Centro de Saúde Norte',
  'Clínica da Família Leste',
  'Policlínica Regional',
] as const;

const CLINICAL_NOTES = [
  'Paciente assintomático, em acompanhamento rotineiro.',
  'Paciente relata desconforto leve. Orientado sobre o tratamento.',
  'Exames de controle realizados. Aguardando resultados.',
  'Paciente compareceu à consulta de retorno. Evolução satisfatória.',
  'Queixa de lesões cutâneas. Encaminhado para dermatologia.',
  'Paciente recebeu orientações sobre prevenção e uso de preservativo.',
  'Tratamento em andamento. Próxima consulta agendada.',
  'Paciente nega sintomas. Exames preventivos solicitados.',
  'Parceiro convocado para avaliação clínica.',
  'Paciente gestante em acompanhamento pré-natal. Tratamento iniciado.',
  'Resposta ao tratamento adequada segundo último controle sorológico.',
  'Paciente com histórico de sífilis prévia. Monitoramento reforçado.',
] as const;

// ─────────────────────────────────────────────────────────────────────────────
// Test Entity Definitions
// ─────────────────────────────────────────────────────────────────────────────
//
// Static definitions for test users (3) and patients (35 Game of Thrones characters).
// All test data is generated with these seeds as a base.

const TEST_USERS = [
  {
    name: 'Varys',
    email: 'varys@mock.com',
    roleCode: 'admin',
    phone: '(11) 91234-5601',
    enrollmentNumber: 'MAT-100001',
    professionalRegistration: 'CRM-100001',
    cpf: '529.982.247-25',
    workplace: 'Hospital Real de Porto Real',
  },
  {
    name: 'Petyr Baelish',
    email: 'petyr.baelish@mock.com',
    roleCode: 'user',
    phone: '(21) 91234-5602',
    enrollmentNumber: 'MAT-100002',
    professionalRegistration: 'CRM-100002',
    cpf: '418.273.956-30',
    workplace: 'Clínica do Dedo Mindinho',
  },
  {
    name: 'Illyrio Mopatis',
    email: 'illyrio.mopatis@mock.com',
    roleCode: 'viewer',
    phone: '(31) 91234-5603',
    enrollmentNumber: 'MAT-100003',
    professionalRegistration: 'CRM-100003',
    cpf: '305.614.738-42',
    workplace: 'Hospital de Pentos',
  },
] as const;

interface PatientDef {
  name: string;
  sex: 'Feminino' | 'Masculino';
  birthYear: number;
  motherName: string;
}

const PATIENTS_DATA: PatientDef[] = [
  {
    name: 'Arya Stark',
    sex: 'Feminino',
    birthYear: 2000,
    motherName: 'Catelyn Tully',
  },
  {
    name: 'Sansa Stark',
    sex: 'Feminino',
    birthYear: 1998,
    motherName: 'Catelyn Tully',
  },
  {
    name: 'Jon Snow',
    sex: 'Masculino',
    birthYear: 1990,
    motherName: 'Lyanna Stark',
  },
  {
    name: 'Bran Stark',
    sex: 'Masculino',
    birthYear: 2002,
    motherName: 'Catelyn Tully',
  },
  {
    name: 'Robb Stark',
    sex: 'Masculino',
    birthYear: 1994,
    motherName: 'Catelyn Tully',
  },
  {
    name: 'Rickon Stark',
    sex: 'Masculino',
    birthYear: 2006,
    motherName: 'Catelyn Tully',
  },
  {
    name: 'Daenerys Targaryen',
    sex: 'Feminino',
    birthYear: 1992,
    motherName: 'Rhaella Targaryen',
  },
  {
    name: 'Tyrion Lannister',
    sex: 'Masculino',
    birthYear: 1985,
    motherName: 'Joanna Lannister',
  },
  {
    name: 'Jaime Lannister',
    sex: 'Masculino',
    birthYear: 1980,
    motherName: 'Joanna Lannister',
  },
  {
    name: 'Cersei Lannister',
    sex: 'Feminino',
    birthYear: 1980,
    motherName: 'Joanna Lannister',
  },
  {
    name: 'Jorah Mormont',
    sex: 'Masculino',
    birthYear: 1968,
    motherName: 'Maege Mormont',
  },
  {
    name: 'Brienne Tarth',
    sex: 'Feminino',
    birthYear: 1985,
    motherName: 'Alerie Tyrell',
  },
  {
    name: 'Melisandre Asshai',
    sex: 'Feminino',
    birthYear: 1960,
    motherName: 'Myranda Royce',
  },
  {
    name: 'Stannis Baratheon',
    sex: 'Masculino',
    birthYear: 1965,
    motherName: 'Mellara Rivers',
  },
  {
    name: 'Renly Baratheon',
    sex: 'Masculino',
    birthYear: 1975,
    motherName: 'Mellara Rivers',
  },
  {
    name: 'Oberyn Martell',
    sex: 'Masculino',
    birthYear: 1972,
    motherName: 'Loreza Sand',
  },
  {
    name: 'Ellaria Sand',
    sex: 'Feminino',
    birthYear: 1978,
    motherName: 'Cassella Vaith',
  },
  {
    name: 'Margaery Tyrell',
    sex: 'Feminino',
    birthYear: 1993,
    motherName: 'Alerie Tyrell',
  },
  {
    name: 'Olenna Tyrell',
    sex: 'Feminino',
    birthYear: 1950,
    motherName: 'Lucinda Tyrell',
  },
  {
    name: 'Theon Greyjoy',
    sex: 'Masculino',
    birthYear: 1988,
    motherName: 'Alannys Harlaw',
  },
  {
    name: 'Asha Greyjoy',
    sex: 'Feminino',
    birthYear: 1985,
    motherName: 'Alannys Harlaw',
  },
  {
    name: 'Samwell Tarly',
    sex: 'Masculino',
    birthYear: 1992,
    motherName: 'Melessa Florent',
  },
  {
    name: 'Davos Seaworth',
    sex: 'Masculino',
    birthYear: 1960,
    motherName: 'Selyse Florent',
  },
  {
    name: 'Bronn Blackwater',
    sex: 'Masculino',
    birthYear: 1975,
    motherName: 'Beth Coldwater',
  },
  {
    name: 'Tormund Giantsbane',
    sex: 'Masculino',
    birthYear: 1970,
    motherName: 'Myranda Royce',
  },
  {
    name: 'Podrick Payne',
    sex: 'Masculino',
    birthYear: 1995,
    motherName: 'Lysa Rivers',
  },
  {
    name: 'Sandor Clegane',
    sex: 'Masculino',
    birthYear: 1977,
    motherName: 'Bethany Ryswell',
  },
  {
    name: 'Gregor Clegane',
    sex: 'Masculino',
    birthYear: 1974,
    motherName: 'Bethany Ryswell',
  },
  {
    name: 'Roose Bolton',
    sex: 'Masculino',
    birthYear: 1962,
    motherName: 'Cassella Vaith',
  },
  {
    name: 'Ramsay Bolton',
    sex: 'Masculino',
    birthYear: 1990,
    motherName: 'Beth Coldwater',
  },
  {
    name: 'Ygritte Wildling',
    sex: 'Feminino',
    birthYear: 1991,
    motherName: 'Alannys Harlaw',
  },
  {
    name: 'Gilly Craster',
    sex: 'Feminino',
    birthYear: 1993,
    motherName: 'Lysa Rivers',
  },
  {
    name: 'Missandei Naath',
    sex: 'Feminino',
    birthYear: 1996,
    motherName: 'Melessa Florent',
  },
  {
    name: 'Hodor Forte',
    sex: 'Masculino',
    birthYear: 1978,
    motherName: 'Myranda Royce',
  },
  {
    name: 'Shae Lhazar',
    sex: 'Feminino',
    birthYear: 1988,
    motherName: 'Cassella Vaith',
  },
];

// ─────────────────────────────────────────────────────────────────────────────
// Seeder Functions
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Seeds three test users with different roles for dashboard testing.
 * All users have the password "Teste@12" hashed with bcryptjs.
 * @return A promise resolving to an array of created user IDs.
 */
async function seedTestUsers(): Promise<string[]> {
  const systemUserId = SYSTEM_CONSTANTS.DEFAULT_SYSTEM_USER_ID;
  const passwordHash = hashSync(
    'Teste@12',
    SECURITY_CONSTANTS.HASH_SALT_ROUNDS
  );
  const userIds: string[] = [];

  for (const userData of TEST_USERS) {
    const role = await prisma.role.findUniqueOrThrow({
      where: { code: userData.roleCode },
    });

    const existing = await prisma.user.findUnique({
      where: { email: userData.email },
    });
    if (existing) {
      userIds.push(existing.id);
      logger.info(`User already exists, skipping: ${userData.email}`);
      continue;
    }

    const createdAt = randomDate();
    const user = await prisma.user.create({
      data: {
        name: userData.name,
        email: userData.email,
        phone: userData.phone,
        enrollmentNumber: userData.enrollmentNumber,
        professionalRegistration: userData.professionalRegistration,
        cpf: userData.cpf,
        workplace: userData.workplace,
        password: passwordHash,
        roleId: role.id,
        isSystem: false,
        createdBy: systemUserId,
        createdAt,
      },
    });

    await prisma.auditLog.create({
      data: {
        userId: systemUserId,
        action: AUDIT_LOG_ACTION.CREATE,
        entityName: AUDIT_LOG_ENTITY.USER,
        entityId: user.id,
        newValues: {
          name: user.name,
          email: user.email,
          role: userData.roleCode,
        },
        createdAt,
      },
    });

    userIds.push(user.id);
  }

  logger.info(`Users seeded: ${userIds.length}`);
  return userIds;
}

/**
 * Seeds 35 test patients with realistic demographics and address information.
 * All patients are named after Game of Thrones characters with varied attributes.
 * @param userIds Array of user IDs for setting creator references.
 * @return A promise resolving to an array of created patient IDs in order.
 */
async function seedTestPatients(userIds: string[]): Promise<string[]> {
  const patientIds: string[] = [];
  const creatorId = userIds[0]; // Varys creates all patients

  for (let i = 0; i < PATIENTS_DATA.length; i++) {
    const def = PATIENTS_DATA[i];
    const cpf = generateCPF(i);

    const existing = await prisma.patient.findUnique({ where: { cpf } });
    if (existing) {
      patientIds.push(existing.id);
      logger.info(`Patient already exists, skipping: ${def.name}`);
      continue;
    }

    const susCardNumber = generateSUSCard(i);
    const state = randomItem(STATES);
    const createdAt = randomDate();

    const patient = await prisma.patient.create({
      data: {
        name: def.name,
        cpf,
        susCardNumber,
        birthDate: new Date(`${def.birthYear}-06-15`),
        sex: def.sex,
        gender: def.sex,
        race: randomItem(RACES),
        sexuality: randomItem(SEXUALITIES),
        nationality: 'Brasileira',
        schooling: randomItem(SCHOOLINGS),
        motherName: def.motherName,
        monitoringType: randomItem(MONITORING_TYPES),
        state,
        city: CITY_BY_STATE[state],
        neighborhood: randomItem(NEIGHBORHOODS),
        street: randomItem(STREETS),
        houseNumber: String(randomInt(1, 999)),
        zipCode: `${String(10000 + i * 37).slice(0, 5)}-${String(100 + ((i * 7) % 900)).padStart(3, '0')}`,
        phone: `(${String(randomInt(11, 99))}) 9${String(randomInt(1000, 9999))}-${String(randomInt(1000, 9999))}`,
        isDeceased: false,
        createdBy: creatorId,
        createdAt,
      },
    });

    await prisma.auditLog.create({
      data: {
        userId: creatorId,
        action: AUDIT_LOG_ACTION.CREATE,
        entityName: AUDIT_LOG_ENTITY.PATIENT,
        entityId: patient.id,
        newValues: {
          name: patient.name,
          cpf: patient.cpf,
          monitoringType: patient.monitoringType,
        },
        createdAt,
      },
    });

    patientIds.push(patient.id);
  }

  logger.info(`Patients seeded: ${patientIds.length}`);
  return patientIds;
}

/**
 * Seeds 5-7 exam records per patient with realistic treponemal and non-treponemal test data.
 * Creates audit log entries for each exam automatically.
 * @param patientIds Array of patient IDs to associate exams with.
 * @param userIds Array of user IDs for rotating creator assignments.
 * @return A promise that resolves when all exams are seeded.
 */
async function seedTestExams(
  patientIds: string[],
  userIds: string[]
): Promise<void> {
  let totalCreated = 0;

  for (const patientId of patientIds) {
    const count = randomInt(5, 7);
    const auditLogs: Prisma.AuditLogCreateManyInput[] = [];

    for (let i = 0; i < count; i++) {
      const createdAt = randomDate();
      const createdBy = userIds[i % userIds.length];
      const testDate = randomDate(SEED_START, createdAt);

      const exam = await prisma.exam.create({
        data: {
          patientId,
          treponemalTestType: randomItem(TREPONEMAL_TYPES),
          treponemalTestResult: randomItem(TREPONEMAL_RESULTS),
          treponemalTestDate: testDate,
          treponemalTestLocation: randomItem(HEALTH_CENTERS),
          nontreponemalVdrlTest: randomItem(NON_TREPONEMAL_TESTS),
          nontreponemalTestTitration: randomItem(NON_TREPONEMAL_TITRATIONS),
          nontreponemalTestDate: testDate,
          referenceObservations: randomItem(CLINICAL_NOTES),
          createdBy,
          createdAt,
        },
      });

      auditLogs.push({
        userId: createdBy,
        action: AUDIT_LOG_ACTION.CREATE,
        entityName: AUDIT_LOG_ENTITY.EXAM,
        entityId: exam.id,
        newValues: {
          patientId,
          treponemalTestType: exam.treponemalTestType,
          treponemalTestResult: exam.treponemalTestResult,
          nontreponemalVdrlTest: exam.nontreponemalVdrlTest,
          nontreponemalTestTitration: exam.nontreponemalTestTitration,
        },
        createdAt,
      });

      totalCreated++;
    }

    await prisma.auditLog.createMany({ data: auditLogs });
  }

  logger.info(`Exams seeded: ${totalCreated}`);
}

/**
 * Seeds 5-7 notification records per patient with SINAN epidemiologic codes.
 * Creates audit log entries for each notification automatically.
 * @param patientIds Array of patient IDs to associate notifications with.
 * @param userIds Array of user IDs for rotating creator assignments.
 * @return A promise that resolves when all notifications are seeded.
 */
async function seedTestNotifications(
  patientIds: string[],
  userIds: string[]
): Promise<void> {
  let totalCreated = 0;
  let sinanCounter = 0;

  for (const patientId of patientIds) {
    const count = randomInt(5, 7);
    const auditLogs: Prisma.AuditLogCreateManyInput[] = [];

    for (let i = 0; i < count; i++) {
      const createdAt = randomDate();
      const createdBy = userIds[i % userIds.length];
      sinanCounter++;

      const notification = await prisma.notification.create({
        data: {
          patientId,
          sinan: String(sinanCounter).padStart(7, '0'),
          observations: randomItem(CLINICAL_NOTES),
          createdBy,
          createdAt,
        },
      });

      auditLogs.push({
        userId: createdBy,
        action: AUDIT_LOG_ACTION.CREATE,
        entityName: AUDIT_LOG_ENTITY.NOTIFICATION,
        entityId: notification.id,
        newValues: { patientId, sinan: notification.sinan },
        createdAt,
      });

      totalCreated++;
    }

    await prisma.auditLog.createMany({ data: auditLogs });
  }

  logger.info(`Notifications seeded: ${totalCreated}`);
}

/**
 * Seeds 5-7 observation records per patient with clinical notes.
 * Creates audit log entries for each observation automatically.
 * @param patientIds Array of patient IDs to associate observations with.
 * @param userIds Array of user IDs for rotating creator assignments.
 * @return A promise that resolves when all observations are seeded.
 */
async function seedTestObservations(
  patientIds: string[],
  userIds: string[]
): Promise<void> {
  let totalCreated = 0;

  for (const patientId of patientIds) {
    const count = randomInt(5, 7);
    const auditLogs: Prisma.AuditLogCreateManyInput[] = [];

    for (let i = 0; i < count; i++) {
      const createdAt = randomDate();
      const createdBy = userIds[i % userIds.length];

      const observation = await prisma.observation.create({
        data: {
          patientId,
          observations: randomItem(CLINICAL_NOTES),
          hasPartnerBeingTreated: i % 3 !== 0,
          createdBy,
          createdAt,
        },
      });

      auditLogs.push({
        userId: createdBy,
        action: AUDIT_LOG_ACTION.CREATE,
        entityName: AUDIT_LOG_ENTITY.OBSERVATION,
        entityId: observation.id,
        newValues: {
          patientId,
          hasPartnerBeingTreated: observation.hasPartnerBeingTreated,
        },
        createdAt,
      });

      totalCreated++;
    }

    await prisma.auditLog.createMany({ data: auditLogs });
  }

  logger.info(`Observations seeded: ${totalCreated}`);
}

/**
 * Seeds 5-7 treatment records per patient with realistic medications and dosages.
 * Creates audit log entries for each treatment automatically.
 * @param patientIds Array of patient IDs to associate treatments with.
 * @param userIds Array of user IDs for rotating creator assignments.
 * @return A promise that resolves when all treatments are seeded.
 */
async function seedTestTreatments(
  patientIds: string[],
  userIds: string[]
): Promise<void> {
  let totalCreated = 0;

  for (const patientId of patientIds) {
    const count = randomInt(5, 7);
    const auditLogs: Prisma.AuditLogCreateManyInput[] = [];

    for (let i = 0; i < count; i++) {
      const createdAt = randomDate();
      const createdBy = userIds[i % userIds.length];
      const medication = randomItem(MEDICATIONS);
      const startDate = randomDate(SEED_START, createdAt);

      const treatment = await prisma.treatment.create({
        data: {
          patientId,
          medication,
          healthCenter: randomItem(HEALTH_CENTERS),
          startDate,
          dosage: DOSAGES[medication],
          observations: randomItem(CLINICAL_NOTES),
          createdBy,
          createdAt,
        },
      });

      auditLogs.push({
        userId: createdBy,
        action: AUDIT_LOG_ACTION.CREATE,
        entityName: AUDIT_LOG_ENTITY.TREATMENT,
        entityId: treatment.id,
        newValues: {
          patientId,
          medication: treatment.medication,
          dosage: treatment.dosage,
          healthCenter: treatment.healthCenter,
        },
        createdAt,
      });

      totalCreated++;
    }

    await prisma.auditLog.createMany({ data: auditLogs });
  }

  logger.info(`Treatments seeded: ${totalCreated}`);
}

// ─────────────────────────────────────────────────────────────────────────────
// Main Entry Point
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Main seeding orchestrator for test data.
 * Executes all seeder functions in sequence to populate the database with:
 * - 3 test users (admin, user, viewer roles)
 * - 35 test patients (Game of Thrones character names)
 * - 175-245 exams, notifications, observations, and treatments per type
 * - Automatic audit log entries for all created records
 *
 * Security: This script only executes in 'development' or 'test' environments.
 * In production, it aborts immediately with process.exit(1).
 *
 * @throws Will exit with code 1 if execution is attempted in production.
 */
async function main(): Promise<void> {
  // Security gate: only allow development and test environments.
  if (env.NODE_ENV === 'production') {
    logger.error(
      `BLOCKED: Test data seeding is not allowed in production environment`,
      {
        action: 'seed_test_aborted',
        nodeEnv: env.NODE_ENV,
      }
    );
    process.exit(1);
  }

  logger.info('Starting test data seed...');

  const userIds = await seedTestUsers();
  const patientIds = await seedTestPatients(userIds);
  await seedTestExams(patientIds, userIds);
  await seedTestNotifications(patientIds, userIds);
  await seedTestObservations(patientIds, userIds);
  await seedTestTreatments(patientIds, userIds);

  const approxTotal = patientIds.length * 6 * 4;
  logger.info(
    `Test data seeding completed. Summary: ${userIds.length} users, ${patientIds.length} patients, ~${approxTotal} clinical records, ~${approxTotal} audit log entries.`
  );
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    logger.error('Test data seeding failed', { error, action: 'seed_test' });
    await prisma.$disconnect();
    process.exit(1);
  });
