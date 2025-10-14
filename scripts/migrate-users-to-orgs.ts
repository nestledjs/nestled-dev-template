/**
 * Migration Script: Add Organizations to Existing Users
 *
 * This script creates a default organization for any users who were created
 * before the multi-tenancy feature was implemented.
 *
 * Run with: pnpm tsx scripts/migrate-users-to-orgs.ts
 */

import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function createOrganizationRoles(organizationId: string) {
  const defaultRoles = [
    {
      name: 'Owner',
      description: 'Full access to organization, including deletion',
      permissions: {
        create: [
          { action: 'read', subject: 'organization' },
          { action: 'update', subject: 'organization' },
          { action: 'delete', subject: 'organization' },
          { action: 'read', subject: 'member' },
          { action: 'invite', subject: 'member' },
          { action: 'update', subject: 'member' },
          { action: 'remove', subject: 'member' },
          { action: 'read', subject: 'role' },
          { action: 'create', subject: 'role' },
          { action: 'update', subject: 'role' },
          { action: 'delete', subject: 'role' },
          { action: 'read', subject: 'billing' },
          { action: 'manage', subject: 'billing' },
          { action: 'read', subject: 'audit' },
        ],
      },
    },
    {
      name: 'Admin',
      description: 'Manage members and settings',
      permissions: {
        create: [
          { action: 'read', subject: 'organization' },
          { action: 'update', subject: 'organization' },
          { action: 'read', subject: 'member' },
          { action: 'invite', subject: 'member' },
          { action: 'update', subject: 'member' },
          { action: 'remove', subject: 'member' },
          { action: 'read', subject: 'role' },
          { action: 'read', subject: 'billing' },
        ],
      },
    },
    {
      name: 'Member',
      description: 'Basic access to organization',
      permissions: {
        create: [
          { action: 'read', subject: 'organization' },
          { action: 'read', subject: 'member' },
          { action: 'read', subject: 'role' },
        ],
      },
    },
  ]

  for (const role of defaultRoles) {
    await prisma.role.create({
      data: {
        ...role,
        organizationId,
      },
    })
  }
}

async function main() {
  console.log('🔍 Finding users without organizations...')

  // Find all users who are not members of any organization
  const usersWithoutOrgs = await prisma.user.findMany({
    where: {
      organizationMemberships: {
        none: {},
      },
    },
    select: {
      id: true,
      firstName: true,
      lastName: true,
      emails: {
        where: { primary: true },
        select: { email: true },
      },
    },
  })

  console.log(`📊 Found ${usersWithoutOrgs.length} users without organizations`)

  if (usersWithoutOrgs.length === 0) {
    console.log('✅ All users already have organizations!')
    return
  }

  console.log('\n🚀 Creating organizations for users...\n')

  for (const user of usersWithoutOrgs) {
    const email = user.emails[0]?.email || 'unknown'
    const orgName = user.firstName
      ? `${user.firstName}'s Organization`
      : `${email}'s Organization`

    console.log(`  👤 ${user.firstName || 'User'} ${user.lastName || ''} (${email})`)

    try {
      // Create organization
      const organization = await prisma.organization.create({
        data: { name: orgName },
      })
      console.log(`     ✅ Created organization: ${orgName}`)

      // Create default roles
      await createOrganizationRoles(organization.id)
      console.log(`     ✅ Created roles`)

      // Get the Owner role
      const ownerRole = await prisma.role.findFirst({
        where: {
          name: 'Owner',
          organizationId: organization.id,
        },
      })

      if (!ownerRole) {
        throw new Error('Failed to find Owner role')
      }

      // Add user as owner
      await prisma.organizationMember.create({
        data: {
          userId: user.id,
          organizationId: organization.id,
          roleId: ownerRole.id,
        },
      })
      console.log(`     ✅ Added user as Owner`)

      // Set as active organization
      await prisma.user.update({
        where: { id: user.id },
        data: { activeOrganizationId: organization.id },
      })
      console.log(`     ✅ Set as active organization\n`)
    } catch (error) {
      console.error(`     ❌ Failed: ${error}\n`)
    }
  }

  console.log('✨ Migration complete!')
}

main()
  .catch((e) => {
    console.error('💥 Migration failed:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
