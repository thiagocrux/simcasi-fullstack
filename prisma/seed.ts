import { PrismaPg } from '@prisma/adapter-pg';
import { hashSync } from 'bcryptjs';
import crypto from 'crypto';
import { Pool } from 'pg';

import { ROLES } from '@/core/domain/constants/role.constants';
import { SECURITY_CONSTANTS } from '@/core/domain/constants/security.constants';
import { PrismaClient } from '@prisma/client';

import {
  PERMISSIONS,
  PERMISSIONS_BY_ROLE,
  isPermission,
} from '@/core/domain/constants/permission.constants';

const connectionString = `${process.env.DATABASE_URL}`;
const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log('🚀 Starting seed for permissions and roles...');

  // Create permissions (idempotent upserts).
  for (const permission of PERMISSIONS) {
    await prisma.permission.upsert({
      where: { code: permission },
      update: {},
      create: { code: permission },
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
    console.error(
      'PRISMA_SEED_PASSWORD must be provided when seeding in production'
    );

    process.exit(1);
  }

  if (seedEmail && !seedPassword && !isProduction) {
    seedPassword = crypto.randomBytes(12).toString('base64url');
    console.log('\n🔑 Generated dev seed user password:', seedPassword);
  }

  await prisma.$transaction(async (transaction) => {
    // Use for...of to ensure we retrieve the upserted roleId for the join table.
    for (const role of ROLES) {
      // Create or update the role.
      const { id: roleId } = await transaction.role.upsert({
        where: { code: role },
        update: {},
        create: { code: role },
      });

      // Grant the configured permissions to the role.
      const rolePermissions = PERMISSIONS_BY_ROLE[role] ?? [];

      for (const permission of rolePermissions) {
        // Validate we expect this permission value.
        if (!isPermission(permission)) {
          console.warn(`Skipping unknown permission code: ${permission}`);
          continue;
        }

        // Retrieve the permission id from a cached map (built below) avoiding repeated DB lookups inside the role loop.
        const permissionId = permissionIdMap.get(permission);

        if (!permissionId) {
          console.warn(`Permission not found in database: ${permission}`);
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
        console.warn(
          'Admin role was not found; bootstrap user will not be created.'
        );
      } else {
        await transaction.user.upsert({
          where: { email: seedEmail },
          update: { password: passwordHash, roleId: adminRoleId },
          create: {
            name: 'Admin',
            email: seedEmail,
            password: passwordHash,
            roleId: adminRoleId,
          },
        });
      }
    }
  });

  // Note: dev/test bootstrap user is now created when PRISMA_SEED_EMAIL/PRISMA_SEED_PASSWORD are set.
  console.log('\n✅ Seeding completed successfully!');
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error(
      '\n❌ Error during seeding. Transaction rollback ensured.',
      error
    );
    await prisma.$disconnect();
    process.exit(1);
  });
