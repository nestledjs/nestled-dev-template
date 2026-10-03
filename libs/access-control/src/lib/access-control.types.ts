export interface AccessControlPermission {
  id: string
  key: string
  namespace: string
  action: string
  description?: string | null
}

export interface AccessControlPrincipal {
  id: string
  displayName?: string | null
  email?: string | null
  isSuperAdmin: boolean
}

export interface AccessControlAssignment {
  id: string
  createdAt: string | Date
  principal: AccessControlPrincipal
}

export interface AccessControlRole {
  id: string
  key: string
  name: string
  description?: string | null
  isSystem: boolean
  permissions: AccessControlPermission[]
  assignments: AccessControlAssignment[]
}

export interface AccessControlSnapshot {
  permissions: AccessControlPermission[]
  roles: AccessControlRole[]
}

export interface AccessControlPrincipalPage {
  principals: AccessControlPrincipal[]
  total: number
}

export interface SaveAccessControlRoleInput {
  name: string
  description?: string
  permissionKeys: string[]
}

export interface PlatformAccessControlAdapter {
  load(): Promise<AccessControlSnapshot>
  searchPrincipals(search: string): Promise<AccessControlPrincipalPage>
  createRole(input: SaveAccessControlRoleInput): Promise<AccessControlRole>
  updateRole(input: SaveAccessControlRoleInput & { roleId: string }): Promise<AccessControlRole>
  deleteRole(roleId: string): Promise<void>
  assignRole(roleId: string, principalId: string): Promise<AccessControlRole>
  revokeRole(roleId: string, principalId: string): Promise<AccessControlRole>
}

export type AccessControlTheme = 'light' | 'dark' | 'system'

export interface PlatformAccessControlProps {
  adapter: PlatformAccessControlAdapter
  canManage?: boolean
  theme?: AccessControlTheme
  className?: string
  title?: string
  description?: string
  onError?: (error: unknown) => void
}
