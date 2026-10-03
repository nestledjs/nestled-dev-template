import '@testing-library/jest-dom/vitest'
import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { vi } from 'vitest'
import { PlatformAccessControl } from './PlatformAccessControl'
import { AccessControlSnapshot, PlatformAccessControlAdapter } from './access-control.types'

const snapshot: AccessControlSnapshot = {
  permissions: [
    {
      id: 'permission-read',
      key: 'platform.users.read',
      namespace: 'platform.users',
      action: 'read',
      description: 'View platform users',
    },
    {
      id: 'permission-manage',
      key: 'platform.users.manage',
      namespace: 'platform.users',
      action: 'manage',
      description: 'Manage platform users',
    },
  ],
  roles: [
    {
      id: 'root-role',
      key: 'system.super-administrator',
      name: 'Super Administrator',
      description: 'Break-glass access',
      isSystem: true,
      permissions: [],
      assignments: [],
    },
    {
      id: 'support-role',
      key: 'custom.support',
      name: 'Support',
      description: 'Read user accounts',
      isSystem: false,
      permissions: [
        {
          id: 'permission-read',
          key: 'platform.users.read',
          namespace: 'platform.users',
          action: 'read',
          description: 'View platform users',
        },
      ],
      assignments: [],
    },
  ],
}

function adapter(): PlatformAccessControlAdapter {
  return {
    load: vi.fn().mockResolvedValue(snapshot),
    searchPrincipals: vi.fn().mockResolvedValue({ principals: [], total: 0 }),
    createRole: vi.fn().mockImplementation(async input => ({
      id: 'new-role',
      key: 'custom.new',
      name: input.name,
      description: input.description,
      isSystem: false,
      permissions: snapshot.permissions.filter(permission =>
        input.permissionKeys.includes(permission.key),
      ),
      assignments: [],
    })),
    updateRole: vi.fn(),
    deleteRole: vi.fn(),
    assignRole: vi.fn(),
    revokeRole: vi.fn(),
  }
}

describe('PlatformAccessControl', () => {
  it('loads a themed role workspace and keeps system roles read-only', async () => {
    const transport = adapter()
    const { container } = render(<PlatformAccessControl adapter={transport} theme="dark" />)

    expect(await screen.findByRole('heading', { name: 'Access control' })).toBeInTheDocument()
    expect(container.querySelector('.nac-root')).toHaveAttribute('data-nac-theme', 'dark')

    fireEvent.click(screen.getByRole('button', { name: /Super Administrator/i }))
    expect(screen.getByText('Protected system role')).toBeInTheDocument()
    expect(screen.queryByRole('button', { name: 'Edit' })).not.toBeInTheDocument()
    expect(screen.queryByRole('button', { name: 'Delete' })).not.toBeInTheDocument()
  })

  it('creates a role through the adapter rather than a generic data client', async () => {
    const transport = adapter()
    render(<PlatformAccessControl adapter={transport} />)
    await screen.findByRole('heading', { name: 'Access control' })

    fireEvent.click(screen.getByRole('button', { name: /New role/i }))
    fireEvent.change(screen.getByLabelText('Name'), { target: { value: 'User Auditor' } })
    fireEvent.change(screen.getByLabelText('Description'), {
      target: { value: 'Can review user accounts' },
    })
    fireEvent.click(screen.getByText('View platform users'))
    fireEvent.click(screen.getByRole('button', { name: 'Create role' }))

    await waitFor(() =>
      expect(transport.createRole).toHaveBeenCalledWith({
        name: 'User Auditor',
        description: 'Can review user accounts',
        permissionKeys: ['platform.users.read'],
      }),
    )
    expect(await screen.findByRole('heading', { name: 'User Auditor' })).toBeInTheDocument()
  })

  it('supports a read-only host integration', async () => {
    render(<PlatformAccessControl adapter={adapter()} canManage={false} />)
    await screen.findByRole('heading', { name: 'Access control' })

    expect(screen.queryByRole('button', { name: /New role/i })).not.toBeInTheDocument()
    fireEvent.click(screen.getByRole('button', { name: /Support/i }))
    expect(screen.queryByRole('button', { name: 'Edit' })).not.toBeInTheDocument()
  })
})
