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

  // Create the admin role if it does not exist (createdBy will be set after system user exists)
  const adminRole = await prisma.role.upsert({
    where: { code: 'admin' },
    update: {},
    create: {
      code: 'admin',
    },
  });

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

  // Now set the admin role's createdBy to the canonical system user for consistent authorship
  await prisma.role.update({
    where: { id: adminRole.id },
    data: { createdBy: systemUserId },
  });
  logger.info('🚀 Starting seed for permissions and roles...');

  // Create permissions (idempotent upserts).
  for (const permission of PERMISSIONS) {
    await prisma.permission.upsert({
      where: { code: permission },
      update: {},
      create: {
        code: permission,
        createdBy: systemUserId,
      },
    });
  }

  // Create Roles and assign permissions (single transaction for atomicity).
  const permissionRecords = await prisma.permission.findMany();

  // Build a map of existing permissions (code->id) with a single query to avoid repeated DB lookups.
  const permissionIdMap = new Map<string, string>(
    permissionRecords.map((permission) => [permission.code, permission.id])
  );

  // Seed user settings (for bootstrapping in dev/test). Use env vars only; fallback to generated password in dev.
  const isProduction = process.env.NODE_ENV === 'production';
  const seedEmail = process.env.PRISMA_SEED_EMAIL?.trim();
  let seedPassword = process.env.PRISMA_SEED_PASSWORD;

  if (isProduction && seedEmail && !seedPassword) {
    logger.error(
      'PRISMA_SEED_PASSWORD must be provided when seeding in production.'
    );

    process.exit(1);
  }

  if (seedEmail && !seedPassword && !isProduction) {
    seedPassword = crypto.randomBytes(12).toString('base64url');
    logger.info('\n🔑 Generated dev seed user password:', seedPassword);
  }

  await prisma.$transaction(async (transaction) => {
    // Use for...of to ensure we retrieve the upserted roleId for the join table.
    for (const role of ROLES) {
      // Create or update the role.
      const { id: roleId } = await transaction.role.upsert({
        where: { code: role },
        update: {},
        create: {
          code: role,
          createdBy: systemUserId,
        },
      });

      // Grant the configured permissions to the role.
      const rolePermissions = PERMISSIONS_BY_ROLE[role] ?? [];

      for (const permission of rolePermissions) {
        // Validate we expect this permission value.
        if (!isPermission(permission)) {
          logger.warn(`Skipping unknown permission code: ${permission}`);
          continue;
        }

        // Retrieve the permission id from a cached map (built below) avoiding repeated DB lookups inside the role loop.
        const permissionId = permissionIdMap.get(permission);

        if (!permissionId) {
          logger.warn(`Permission not found in database: ${permission}`);
          continue;
        }

        // Populate the join table using upsert (composite key).
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

    // Create or update the bootstrap user if configured.
    if (seedEmail && seedPassword) {
      const passwordHash = hashSync(
        seedPassword,
        SECURITY_CONSTANTS.HASH_SALT_ROUNDS
      );

      const adminRoleRecord = await transaction.role.findUnique({
        where: { code: 'admin' },
      });

      const adminRoleId = adminRoleRecord?.id;

      if (!adminRoleId) {
        logger.warn(
          'Admin role was not found; bootstrap user will not be created.'
        );
      } else {
        // The Admin user is created by the system user (canonical ID) to maintain traceable authorship.
        await transaction.user.upsert({
          where: { email: seedEmail },
          update: { password: passwordHash, roleId: adminRoleId },
          create: {
            name: 'Admin',
            email: seedEmail,
            password: passwordHash,
            roleId: adminRoleId,
            createdBy: systemUserId,
          },
        });
      }
    }
  });

  // NOTE: bootstrap user is now created when PRISMA_SEED_EMAIL/PRISMA_SEED_PASSWORD are set.
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
