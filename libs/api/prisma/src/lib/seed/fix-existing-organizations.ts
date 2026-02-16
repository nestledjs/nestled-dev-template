/**
 * Fix script for existing organizations created before RBAC was implemented
 *
 * This script:
 * 1. Ensures all default permissions exist in the database
 * 2. Creates default roles (Owner, Admin, Member) for organizations that don't have them
 * 3. Connects permissions to roles that are missing them
 * 4. Assigns the Owner role to organization members who don't have a role
 *
 * Run with: npx ts-node -r tsconfig-paths/register libs/api/prisma/src/lib/seed/fix-existing-organizations.ts
 */

import 'dotenv/config'
import { PrismaClient } from '../prisma-generated/client'
import { PrismaPg } from '@prisma/adapter-pg'
import { defaultPermissions, defaultRoles } from './seed-data/seed-roles-permissions'

const adapter = new PrismaPg({ connectionString: process.env['DATABASE_URL']! })
const prisma = new PrismaClient({ adapter })

async function fixExistingOrganizations() {
  console.log('=== Fixing Existing Organizations for RBAC ===\n')

  // Step 1: Ensure all default permissions exist
  console.log('Step 1: Ensuring default permissions exist...')
  for (const permission of defaultPermissions) {
    await prisma.permission.upsert({
      where: { action_subject: { action: permission.action, subject: permission.subject } },
      update: {},
      create: permission,
    })
  }
  console.log(`✓ ${defaultPermissions.length} permissions verified\n`)

  // Get all permissions for connecting to roles
  const allPermissions = await prisma.permission.findMany()
  console.log(`Found ${allPermissions.length} total permissions in database\n`)

  // Step 2: Find all organizations
  const organizations = await prisma.organization.findMany({
    include: {
      roles: {
        include: {
          permissions: true,
        },
      },
      members: {
        include: {
          user: true,
          role: true,
        },
      },
    },
  })

  console.log(`Found ${organizations.length} organization(s) to check\n`)

  let fixedRolesCount = 0
  let fixedMembersCount = 0
  let createdRolesCount = 0

  for (const org of organizations) {
    console.log(`\nProcessing organization: ${org.name} (${org.id})`)
    console.log(`  - Current roles: ${org.roles.length}`)
    console.log(`  - Current members: ${org.members.length}`)

    // Step 3: Create default roles if they don't exist
    const existingRoleNames = org.roles.map(r => r.name)
    const missingRoles = defaultRoles.filter(r => !existingRoleNames.includes(r.name))

    if (missingRoles.length > 0) {
      console.log(`  Creating ${missingRoles.length} missing role(s)...`)

      for (const roleTemplate of missingRoles) {
        // Find permissions that match this role's permission strings
        const rolePermissions = allPermissions.filter(p =>
          roleTemplate.permissions.includes(`${p.subject}:${p.action}`)
        )

        await prisma.role.create({
          data: {
            name: roleTemplate.name,
            description: roleTemplate.description,
            organizationId: org.id,
            permissions: {
              connect: rolePermissions.map(p => ({ id: p.id })),
            },
          },
        })
        console.log(`  ✓ Created role: ${roleTemplate.name} (${rolePermissions.length} permissions)`)
        createdRolesCount++
      }
    } else {
      console.log('  ✓ All default roles exist')
    }

    // Step 4: Fix existing roles that have no permissions
    for (const role of org.roles) {
      const roleTemplate = defaultRoles.find(r => r.name === role.name)
      if (!roleTemplate) continue // Skip non-default roles

      if (role.permissions.length === 0) {
        console.log(`  Fixing role "${role.name}" - has 0 permissions...`)

        // Find permissions that match this role's permission strings
        const rolePermissions = allPermissions.filter(p =>
          roleTemplate.permissions.includes(`${p.subject}:${p.action}`)
        )

        await prisma.role.update({
          where: { id: role.id },
          data: {
            permissions: {
              connect: rolePermissions.map(p => ({ id: p.id })),
            },
          },
        })
        console.log(`  ✓ Connected ${rolePermissions.length} permissions to role "${role.name}"`)
        fixedRolesCount++
      }
    }

    // Step 5: Fix members without roles
    const membersWithoutRole = org.members.filter(m => !m.roleId)

    if (membersWithoutRole.length > 0) {
      console.log(`  Fixing ${membersWithoutRole.length} member(s) without roles...`)

      // Get the Owner role for this organization
      const ownerRole = await prisma.role.findFirst({
        where: {
          name: 'Owner',
          organizationId: org.id,
        },
      })

      if (!ownerRole) {
        console.log('  ✗ ERROR: Owner role not found after creation!')
        continue
      }

      for (const member of membersWithoutRole) {
        await prisma.organizationMember.update({
          where: { id: member.id },
          data: { roleId: ownerRole.id },
        })
        console.log(`  ✓ Assigned Owner role to ${member.user.displayName || member.user.firstName || member.userId}`)
        fixedMembersCount++
      }
    }

    // Step 6: Check if there are any members at all - if not, we need to find who should be the owner
    if (org.members.length === 0) {
      console.log('  ⚠ No members found for this organization')
      console.log('  This organization may need manual intervention to assign an owner')
    }
  }

  console.log('\n=== Summary ===')
  console.log(`Roles created: ${createdRolesCount}`)
  console.log(`Roles fixed (permissions connected): ${fixedRolesCount}`)
  console.log(`Members fixed (role assigned): ${fixedMembersCount}`)
  console.log('\n=== Fix Complete ===')
}

fixExistingOrganizations()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async e => {
    console.error('Error fixing organizations:', e)
    await prisma.$disconnect()
    process.exit(1)
  })
