import { PrismaPg } from '@prisma/adapter-pg';
import { hashSync } from 'bcryptjs';
import crypto from 'crypto';
import 'dotenv/config';
import { Pool } from 'pg';

import {
  PERMISSIONS,
  PERMISSIONS_BY_ROLE,
  isPermission,
} from '@/core/domain/constants/permission.constants';
import { ROLES } from '@/core/domain/constants/role.constants';
import { SECURITY_CONSTANTS } from '@/core/domain/constants/security.constants';
import { SYSTEM_CONSTANTS } from '@/core/domain/constants/system.constants';
import { logger } from '@/lib/logger.utils';
import { PrismaClient } from '@prisma/client';

const connectionString = `${process.env.DATABASE_URL}`;
const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  // Ensure a canonical system user exists for FK integrity (idempotent, must be first!)
  const systemUserId = SYSTEM_CONSTANTS.DEFAULT_SYSTEM_USER_ID;
  const systemEmail = (
    process.env.PRISMA_SYSTEM_EMAIL || 'system@simcasi.local'
  ).trim();
  const systemPassword = crypto.randomBytes(12).toString('base64url');
  const systemPasswordHash = hashSync(
    systemPassword,
    SECURITY_CONSTANTS.HASH_SALT_ROUNDS
  );

  // 1. Create permissions (idempotent upserts) WITHOUT createdBy so we can create them before the system user.
  for (const permission of PERMISSIONS) {
    await prisma.permission.upsert({
      where: { code: permission.code },
      update: {},
      create: {
        code: permission.code,
        label: permission.label,
      },
    });
  }

  // 2. Create Roles (idempotent upserts) WITHOUT createdBy so roles exist before creating the canonical user.
  for (const role of ROLES) {
    await prisma.role.upsert({
      where: { code: role.code },
      update: { label: role.label },
      create: {
        code: role.code,
        label: role.label,
      },
    });
  }

  // 3. Ensure admin role exists and retrieve it to attach to the system user.
  const adminRole = await prisma.role.findUnique({ where: { code: 'admin' } });
  if (!adminRole) {
    logger.error('Admin role was not created as expected.');
    process.exit(1);
  }

  // 4. Create the canonical system user (now that admin role exists).
  await prisma.user.upsert({
    where: { id: systemUserId },
    update: {},
    create: {
      id: systemUserId,
      name: 'System',
      email: systemEmail,
      password: systemPasswordHash,
      isSystem: true,
      roleId: adminRole.id,
    },
  });

  // 5. Create default non-system admin user from env (SIMCASI Admin)
  const seedEmail = process.env.PRISMA_SEED_EMAIL?.trim();
  const seedPassword = process.env.PRISMA_SEED_PASSWORD;
  if (seedEmail && seedPassword) {
    const seedPasswordHash = hashSync(
      seedPassword,
      SECURITY_CONSTANTS.HASH_SALT_ROUNDS
    );

    await prisma.user.upsert({
      where: { email: seedEmail },
      update: {
        password: seedPasswordHash,
        roleId: adminRole.id,
        name: 'SIMCASI Admin',
        isSystem: false,
      },
      create: {
        name: 'SIMCASI Admin',
        email: seedEmail,
        password: seedPasswordHash,
        roleId: adminRole.id,
        isSystem: false,
        createdBy: systemUserId,
      },
    });
  } else {
    logger.info(
      'PRISMA_SEED_EMAIL/PRISMA_SEED_PASSWORD not set — skipping default admin user creation.'
    );
  }

  // 6. After system user exists, set createdBy on roles and permissions and associate permissions to roles atomically.
  logger.info(
    '🚀 Starting seed for setting authorship and role-permissions...'
  );

  // Build permission map
  const permissionRecords = await prisma.permission.findMany();
  const permissionIdMap = new Map<string, string>(
    permissionRecords.map((permission) => [permission.code, permission.id])
  );

  await prisma.$transaction(async (transaction) => {
    // Update createdBy for roles
    for (const role of ROLES) {
      await transaction.role.updateMany({
        where: { code: role.code, createdBy: null },
        data: { createdBy: systemUserId },
      });
    }

    // Update createdBy for permissions
    for (const permission of PERMISSIONS) {
      await transaction.permission.updateMany({
        where: { code: permission.code, createdBy: null },
        data: { createdBy: systemUserId },
      });
    }

    // Populate rolePermission join table
    for (const role of ROLES) {
      const roleRecord = await transaction.role.findUnique({
        where: { code: role.code },
      });

      if (!roleRecord) {
        logger.warn(`Role not found when assigning permissions: ${role.code}`);
        continue;
      }

      const roleId = roleRecord.id;
      const rolePermissions = PERMISSIONS_BY_ROLE[role.code] ?? [];

      for (const permission of rolePermissions) {
        if (!isPermission(permission)) {
          logger.warn(`Skipping unknown permission code: ${permission}`);
          continue;
        }

        const permissionId = permissionIdMap.get(permission);
        if (!permissionId) {
          logger.warn(`Permission not found in database: ${permission}`);
          continue;
        }

        await transaction.rolePermission.upsert({
          where: {
            roleId_permissionId: {
              roleId,
              permissionId,
            },
          },
          update: {},
          create: { roleId, permissionId },
        });
      }
    }
  });

  logger.info('✅ Seeding completed successfully!');
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    logger.error(
      '\n❌ Error during seeding. Transaction rollback ensured.',
      error
    );
    await prisma.$disconnect();
    process.exit(1);
  });
