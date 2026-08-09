import { BadRequestException, ForbiddenException } from '@nestjs/common'
import { User } from '@nestled-template/api/core/models'
import { PlatformAccessControlService } from './access-control.service'

const actor = { id: 'actor-1', isSuperAdmin: true } as User

function createDataMock() {
  const transaction = {
    platformRole: {
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
    platformRoleAssignment: {
      upsert: jest.fn(),
      delete: jest.fn(),
    },
    auditLog: { create: jest.fn() },
  }
  const data = {
    platformRoleAssignment: {
      findMany: jest.fn(),
      findUnique: jest.fn(),
    },
    platformPermission: { findMany: jest.fn() },
    platformRole: {
      findMany: jest.fn(),
      findUnique: jest.fn(),
      findFirst: jest.fn(),
    },
    user: {
      findMany: jest.fn(),
      findUnique: jest.fn(),
      count: jest.fn(),
    },
    $transaction: jest.fn(async callback => callback(transaction)),
  }
  return { data, transaction }
}

describe('PlatformAccessControlService', () => {
  it('returns a de-duplicated grant set across assigned roles', async () => {
    const { data } = createDataMock()
    data.platformRoleAssignment.findMany.mockResolvedValue([
      { role: { permissions: [{ key: 'platform.users.read' }] } },
      {
        role: {
          permissions: [{ key: 'platform.users.read' }, { key: 'platform.audit.read' }],
        },
      },
    ])
    const service = new PlatformAccessControlService(data as never)

    await expect(service.getUserPlatformPermissions('user-1')).resolves.toEqual([
      'platform.users.read',
      'platform.audit.read',
    ])
  })

  it('allows delegated management only when the actor covers every target capability', async () => {
    const { data } = createDataMock()
    data.user.findUnique
      .mockResolvedValueOnce({ id: 'actor-1', isSuperAdmin: false })
      .mockResolvedValueOnce({ id: 'target-1', isSuperAdmin: false })
    data.platformRoleAssignment.findMany
      .mockResolvedValueOnce([
        {
          role: {
            permissions: [{ key: 'platform.users.manage' }, { key: 'platform.audit.read' }],
          },
        },
      ])
      .mockResolvedValueOnce([{ role: { permissions: [{ key: 'platform.audit.read' }] } }])
    const service = new PlatformAccessControlService(data as never)

    await expect(service.assertCanManagePrincipal('actor-1', 'target-1')).resolves.toBeUndefined()
  })

  it('rejects delegated management when the target has an uncovered capability', async () => {
    const { data } = createDataMock()
    data.user.findUnique
      .mockResolvedValueOnce({ id: 'actor-1', isSuperAdmin: false })
      .mockResolvedValueOnce({ id: 'target-1', isSuperAdmin: false })
    data.platformRoleAssignment.findMany
      .mockResolvedValueOnce([{ role: { permissions: [{ key: 'platform.users.manage' }] } }])
      .mockResolvedValueOnce([{ role: { permissions: [{ key: 'platform.audit.read' }] } }])
    const service = new PlatformAccessControlService(data as never)

    await expect(service.assertCanManagePrincipal('actor-1', 'target-1')).rejects.toBeInstanceOf(
      ForbiddenException,
    )
  })

  it('rejects delegated management of a peer with equal platform access', async () => {
    const { data } = createDataMock()
    data.user.findUnique
      .mockResolvedValueOnce({ id: 'actor-1', isSuperAdmin: false })
      .mockResolvedValueOnce({ id: 'target-1', isSuperAdmin: false })
    const grants = [{ role: { permissions: [{ key: 'platform.users.manage' }] } }]
    data.platformRoleAssignment.findMany.mockResolvedValueOnce(grants).mockResolvedValueOnce(grants)
    const service = new PlatformAccessControlService(data as never)

    await expect(service.assertCanManagePrincipal('actor-1', 'target-1')).rejects.toBeInstanceOf(
      ForbiddenException,
    )
  })

  it('never allows emulation of a root administrator', async () => {
    const { data } = createDataMock()
    data.user.findUnique
      .mockResolvedValueOnce({ id: 'root-1', isSuperAdmin: true })
      .mockResolvedValueOnce({ id: 'root-2', isSuperAdmin: true })
    const service = new PlatformAccessControlService(data as never)

    await expect(
      service.assertCanManagePrincipal('root-1', 'root-2', 'emulate'),
    ).rejects.toBeInstanceOf(ForbiddenException)
    expect(data.platformRoleAssignment.findMany).not.toHaveBeenCalled()
  })

  it('rejects permission keys that are not in the code-owned catalog', async () => {
    const { data } = createDataMock()
    data.platformPermission.findMany.mockResolvedValue([])
    const service = new PlatformAccessControlService(data as never)

    await expect(
      service.createRole(actor, {
        name: 'Support',
        permissionKeys: ['platform.made-up.manage'],
      }),
    ).rejects.toBeInstanceOf(BadRequestException)
  })

  it('reserves the platform wildcard for the immutable root role', async () => {
    const { data } = createDataMock()
    const service = new PlatformAccessControlService(data as never)

    await expect(
      service.createRole(actor, {
        name: 'Another root',
        permissionKeys: ['platform.*'],
      }),
    ).rejects.toBeInstanceOf(BadRequestException)
    expect(data.platformPermission.findMany).not.toHaveBeenCalled()
  })

  it('creates a custom role and its audit event in one transaction', async () => {
    const { data, transaction } = createDataMock()
    const permission = {
      id: 'permission-1',
      key: 'platform.users.read',
      namespace: 'platform.users',
      action: 'read',
      description: 'View users',
    }
    data.platformPermission.findMany.mockResolvedValue([permission])
    transaction.platformRole.create.mockResolvedValue({
      id: 'role-1',
      key: 'custom.role-1',
      name: 'Support',
      description: null,
      isSystem: false,
      permissions: [permission],
      assignments: [],
    })
    const service = new PlatformAccessControlService(data as never)

    await expect(
      service.createRole(actor, {
        name: 'Support',
        permissionKeys: ['platform.users.read'],
      }),
    ).resolves.toMatchObject({ id: 'role-1', name: 'Support' })
    expect(transaction.platformRole.create).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({
          name: 'Support',
          permissions: { connect: [{ id: 'permission-1' }] },
        }),
      }),
    )
    expect(transaction.auditLog.create).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({ action: 'PLATFORM_ROLE_CREATED', entityId: 'role-1' }),
      }),
    )
  })

  it('does not permit assignment of immutable system roles', async () => {
    const { data } = createDataMock()
    data.platformRole.findUnique.mockResolvedValue({
      id: 'root-role',
      isSystem: true,
      permissions: [],
      assignments: [],
    })
    const service = new PlatformAccessControlService(data as never)

    await expect(service.assignRole(actor, 'root-role', 'user-1')).rejects.toBeInstanceOf(
      ForbiddenException,
    )
    expect(data.user.findUnique).not.toHaveBeenCalled()
  })

  it('refuses to assign a platform role to an inactive principal', async () => {
    const { data } = createDataMock()
    data.platformRole.findUnique.mockResolvedValue({
      id: 'role-1',
      name: 'Support',
      isSystem: false,
      permissions: [],
      assignments: [],
    })
    data.user.findUnique.mockResolvedValue({ isActive: false })
    const service = new PlatformAccessControlService(data as never)

    await expect(service.assignRole(actor, 'role-1', 'user-1')).rejects.toBeInstanceOf(
      BadRequestException,
    )
  })

  it('applies the principal ceiling before assigning a delegated platform role', async () => {
    const { data, transaction } = createDataMock()
    data.platformRole.findUnique.mockResolvedValue({
      id: 'role-1',
      name: 'Support',
      isSystem: false,
      permissions: [{ key: 'platform.users.read' }],
      assignments: [],
    })
    const delegatedGrants = [
      {
        role: {
          permissions: [{ key: 'platform.users.read' }, { key: 'platform.users.manage' }],
        },
      },
    ]
    data.platformRoleAssignment.findMany
      .mockResolvedValueOnce(delegatedGrants)
      .mockResolvedValueOnce(delegatedGrants)
      .mockResolvedValueOnce(delegatedGrants)
    data.user.findUnique
      .mockResolvedValueOnce({ isActive: true })
      .mockResolvedValueOnce({ id: 'actor-1', isSuperAdmin: false })
      .mockResolvedValueOnce({ id: 'target-1', isSuperAdmin: false })
    const service = new PlatformAccessControlService(data as never)
    const delegatedActor = { id: 'actor-1', isSuperAdmin: false } as User

    await expect(service.assignRole(delegatedActor, 'role-1', 'target-1')).rejects.toBeInstanceOf(
      ForbiddenException,
    )
    expect(transaction.platformRoleAssignment.upsert).not.toHaveBeenCalled()
  })

  it('does not let a delegated administrator edit a role held by an equal principal', async () => {
    const { data } = createDataMock()
    data.platformRole.findUnique.mockResolvedValue({
      id: 'role-1',
      key: 'custom.support',
      name: 'Support',
      description: null,
      isSystem: false,
      permissions: [{ key: 'platform.users.read' }],
      assignments: [{ id: 'assignment-1', userId: 'target-1' }],
    })
    const delegatedGrants = [
      {
        role: {
          permissions: [{ key: 'platform.users.read' }, { key: 'platform.access-control.manage' }],
        },
      },
    ]
    data.platformRoleAssignment.findMany
      .mockResolvedValueOnce(delegatedGrants)
      .mockResolvedValueOnce(delegatedGrants)
      .mockResolvedValueOnce(delegatedGrants)
    data.user.findUnique
      .mockResolvedValueOnce({ id: 'actor-1', isSuperAdmin: false })
      .mockResolvedValueOnce({ id: 'target-1', isSuperAdmin: false })
    const service = new PlatformAccessControlService(data as never)
    const delegatedActor = { id: 'actor-1', isSuperAdmin: false } as User

    await expect(
      service.updateRole(delegatedActor, {
        roleId: 'role-1',
        name: 'Support',
        permissionKeys: ['platform.users.read'],
      }),
    ).rejects.toBeInstanceOf(ForbiddenException)
    expect(data.$transaction).not.toHaveBeenCalled()
  })
})
