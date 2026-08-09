import { FormEvent, useCallback, useEffect, useMemo, useState } from 'react'
import './access-control.css'
import {
  AccessControlPermission,
  AccessControlPrincipal,
  AccessControlRole,
  AccessControlSnapshot,
  PlatformAccessControlProps,
  SaveAccessControlRoleInput,
} from './access-control.types'

type View = 'roles' | 'permissions'

function errorMessage(error: unknown): string {
  return error instanceof Error ? error.message : 'The access-control request failed.'
}

function principalName(principal: AccessControlPrincipal): string {
  return principal.displayName || principal.email || principal.id
}

function permissionGroups(permissions: AccessControlPermission[]) {
  const groups = new Map<string, AccessControlPermission[]>()
  for (const permission of permissions) {
    const group = groups.get(permission.namespace) ?? []
    group.push(permission)
    groups.set(permission.namespace, group)
  }
  return [...groups.entries()]
}

interface RoleEditorProps {
  role?: AccessControlRole
  permissions: AccessControlPermission[]
  busy: boolean
  onCancel: () => void
  onSave: (input: SaveAccessControlRoleInput) => Promise<void>
}

function RoleEditor({ role, permissions, busy, onCancel, onSave }: Readonly<RoleEditorProps>) {
  const [name, setName] = useState(role?.name ?? '')
  const [description, setDescription] = useState(role?.description ?? '')
  const [selected, setSelected] = useState(
    () => new Set(role?.permissions.map(permission => permission.key) ?? []),
  )
  const groups = useMemo(() => permissionGroups(permissions), [permissions])

  const submit = async (event: FormEvent) => {
    event.preventDefault()
    await onSave({ name, description, permissionKeys: [...selected] })
  }

  const togglePermission = (key: string) => {
    setSelected(current => {
      const next = new Set(current)
      if (next.has(key)) next.delete(key)
      else next.add(key)
      return next
    })
  }

  return (
    <div className="nac-modal-backdrop" role="presentation">
      <section
        className="nac-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="nac-role-title"
      >
        <form onSubmit={submit}>
          <header className="nac-modal-header">
            <div>
              <p className="nac-eyebrow">Platform role</p>
              <h2 id="nac-role-title">{role ? 'Edit role' : 'Create role'}</h2>
            </div>
            <button type="button" className="nac-icon-button" onClick={onCancel} aria-label="Close">
              ×
            </button>
          </header>

          <div className="nac-modal-body">
            <label className="nac-field">
              <span>Name</span>
              <input
                value={name}
                onChange={event => setName(event.target.value)}
                minLength={2}
                maxLength={80}
                required
                autoFocus
              />
            </label>
            <label className="nac-field">
              <span>Description</span>
              <textarea
                value={description}
                onChange={event => setDescription(event.target.value)}
                maxLength={500}
                rows={3}
              />
            </label>

            <fieldset className="nac-permission-picker">
              <legend>Permissions</legend>
              <p>Select the capabilities this role may grant.</p>
              <div className="nac-permission-groups">
                {groups.map(([namespace, group]) => (
                  <section key={namespace} className="nac-permission-group">
                    <h3>{namespace}</h3>
                    {group.map(permission => (
                      <label key={permission.key} className="nac-check-row">
                        <input
                          type="checkbox"
                          checked={selected.has(permission.key)}
                          onChange={() => togglePermission(permission.key)}
                        />
                        <span>
                          <strong>{permission.action}</strong>
                          <small>{permission.description || permission.key}</small>
                        </span>
                      </label>
                    ))}
                  </section>
                ))}
              </div>
            </fieldset>
          </div>

          <footer className="nac-modal-footer">
            <button type="button" className="nac-button nac-button-secondary" onClick={onCancel}>
              Cancel
            </button>
            <button type="submit" className="nac-button nac-button-primary" disabled={busy}>
              {busy ? 'Saving…' : role ? 'Save role' : 'Create role'}
            </button>
          </footer>
        </form>
      </section>
    </div>
  )
}

interface AssignmentPickerProps {
  busy: boolean
  search: (value: string) => Promise<AccessControlPrincipal[]>
  assign: (principal: AccessControlPrincipal) => Promise<void>
  onClose: () => void
  onError: (error: unknown) => void
}

function AssignmentPicker({
  busy,
  search,
  assign,
  onClose,
  onError,
}: Readonly<AssignmentPickerProps>) {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<AccessControlPrincipal[]>([])
  const [searching, setSearching] = useState(false)

  useEffect(() => {
    let active = true
    const timer = window.setTimeout(async () => {
      setSearching(true)
      try {
        const principals = await search(query)
        if (active) setResults(principals)
      } catch (reason) {
        if (active) {
          setResults([])
          onError(reason)
        }
      } finally {
        if (active) setSearching(false)
      }
    }, 200)
    return () => {
      active = false
      window.clearTimeout(timer)
    }
  }, [onError, query, search])

  return (
    <div className="nac-modal-backdrop" role="presentation">
      <section
        className="nac-modal nac-modal-compact"
        role="dialog"
        aria-modal="true"
        aria-labelledby="nac-assign-title"
      >
        <header className="nac-modal-header">
          <div>
            <p className="nac-eyebrow">Role assignment</p>
            <h2 id="nac-assign-title">Add a person</h2>
          </div>
          <button type="button" className="nac-icon-button" onClick={onClose} aria-label="Close">
            ×
          </button>
        </header>
        <div className="nac-modal-body">
          <label className="nac-field">
            <span>Search users</span>
            <input
              type="search"
              value={query}
              onChange={event => setQuery(event.target.value)}
              placeholder="Name or email"
              autoFocus
            />
          </label>
          <div className="nac-search-results" aria-live="polite">
            {searching && <p className="nac-muted">Searching…</p>}
            {!searching && results.length === 0 && <p className="nac-muted">No users found.</p>}
            {!searching &&
              results.map(principal => (
                <button
                  type="button"
                  className="nac-person-option"
                  key={principal.id}
                  disabled={busy}
                  onClick={() => assign(principal)}
                >
                  <span className="nac-avatar">
                    {principalName(principal).slice(0, 1).toUpperCase()}
                  </span>
                  <span>
                    <strong>{principalName(principal)}</strong>
                    {principal.email && principal.email !== principal.displayName && (
                      <small>{principal.email}</small>
                    )}
                  </span>
                  {principal.isSuperAdmin && <span className="nac-badge">Root</span>}
                </button>
              ))}
          </div>
        </div>
      </section>
    </div>
  )
}

export function PlatformAccessControl({
  adapter,
  canManage = true,
  theme = 'system',
  className = '',
  title = 'Access control',
  description = 'Define platform roles and assign them without exposing generic database access.',
  onError,
}: Readonly<PlatformAccessControlProps>) {
  const [snapshot, setSnapshot] = useState<AccessControlSnapshot | null>(null)
  const [selectedRoleId, setSelectedRoleId] = useState<string | null>(null)
  const [view, setView] = useState<View>('roles')
  const [loading, setLoading] = useState(true)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [editingRole, setEditingRole] = useState<AccessControlRole | 'new' | null>(null)
  const [assigning, setAssigning] = useState(false)

  const reportError = useCallback(
    (reason: unknown) => {
      setError(errorMessage(reason))
      onError?.(reason)
    },
    [onError],
  )

  const load = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const next = await adapter.load()
      setSnapshot(next)
      setSelectedRoleId(current =>
        current && next.roles.some(role => role.id === current)
          ? current
          : (next.roles[0]?.id ?? null),
      )
    } catch (reason) {
      reportError(reason)
    } finally {
      setLoading(false)
    }
  }, [adapter, reportError])

  useEffect(() => {
    void load()
  }, [load])

  const selectedRole = snapshot?.roles.find(role => role.id === selectedRoleId) ?? null
  const customRoles = snapshot?.roles.filter(role => !role.isSystem).length ?? 0
  const assignedPeople =
    new Set(snapshot?.roles.flatMap(role => role.assignments.map(item => item.principal.id)))
      .size ?? 0

  const replaceRole = (role: AccessControlRole) => {
    setSnapshot(current =>
      current
        ? { ...current, roles: current.roles.map(item => (item.id === role.id ? role : item)) }
        : current,
    )
  }

  const run = async (operation: () => Promise<void>): Promise<boolean> => {
    setBusy(true)
    setError(null)
    try {
      await operation()
      return true
    } catch (reason) {
      reportError(reason)
      return false
    } finally {
      setBusy(false)
    }
  }

  const saveRole = async (input: SaveAccessControlRoleInput) => {
    await run(async () => {
      if (editingRole && editingRole !== 'new') {
        replaceRole(await adapter.updateRole({ ...input, roleId: editingRole.id }))
      } else {
        const role = await adapter.createRole(input)
        setSnapshot(current =>
          current ? { ...current, roles: [...current.roles, role] } : current,
        )
        setSelectedRoleId(role.id)
      }
      setEditingRole(null)
    })
  }

  const deleteSelectedRole = async () => {
    if (!selectedRole || !window.confirm(`Delete “${selectedRole.name}”?`)) return
    await run(async () => {
      await adapter.deleteRole(selectedRole.id)
      setSnapshot(current =>
        current
          ? { ...current, roles: current.roles.filter(role => role.id !== selectedRole.id) }
          : current,
      )
      setSelectedRoleId(null)
    })
  }

  const searchPrincipals = useCallback(
    async (query: string) => {
      const page = await adapter.searchPrincipals(query)
      const assignedIds = new Set(
        selectedRole?.assignments.map(assignment => assignment.principal.id) ?? [],
      )
      return page.principals.filter(principal => !assignedIds.has(principal.id))
    },
    [adapter, selectedRole],
  )

  if (loading) {
    return (
      <section className={`nac-root ${className}`} data-nac-theme={theme} aria-busy="true">
        <div className="nac-loading-card">
          <span className="nac-spinner" aria-hidden="true" />
          <p>Loading access control…</p>
        </div>
      </section>
    )
  }

  if (!snapshot) {
    return (
      <section className={`nac-root ${className}`} data-nac-theme={theme}>
        <div className="nac-error-card" role="alert">
          <h2>Access control is unavailable</h2>
          <p>{error}</p>
          <button
            type="button"
            className="nac-button nac-button-primary"
            onClick={() => void load()}
          >
            Try again
          </button>
        </div>
      </section>
    )
  }

  return (
    <section className={`nac-root ${className}`} data-nac-theme={theme}>
      <header className="nac-page-header">
        <div>
          <p className="nac-eyebrow">Platform administration</p>
          <h1>{title}</h1>
          <p>{description}</p>
        </div>
        {canManage && (
          <button
            type="button"
            className="nac-button nac-button-primary"
            onClick={() => setEditingRole('new')}
          >
            <span aria-hidden="true">＋</span> New role
          </button>
        )}
      </header>

      {error && (
        <div className="nac-inline-error" role="alert">
          <span>{error}</span>
          <button type="button" onClick={() => setError(null)} aria-label="Dismiss error">
            ×
          </button>
        </div>
      )}

      <div className="nac-metrics" aria-label="Access control summary">
        <article>
          <strong>{snapshot.roles.length}</strong>
          <span>Total roles</span>
        </article>
        <article>
          <strong>{customRoles}</strong>
          <span>Custom roles</span>
        </article>
        <article>
          <strong>{snapshot.permissions.length}</strong>
          <span>Capabilities</span>
        </article>
        <article>
          <strong>{assignedPeople}</strong>
          <span>Assigned people</span>
        </article>
      </div>

      <div className="nac-tabs" role="tablist" aria-label="Access control views">
        <button
          type="button"
          role="tab"
          aria-selected={view === 'roles'}
          onClick={() => setView('roles')}
        >
          Roles
        </button>
        <button
          type="button"
          role="tab"
          aria-selected={view === 'permissions'}
          onClick={() => setView('permissions')}
        >
          Permission catalog
        </button>
      </div>

      {view === 'roles' ? (
        <div className="nac-workspace">
          <aside className="nac-role-list" aria-label="Platform roles">
            {snapshot.roles.length === 0 && (
              <p className="nac-empty">No roles have been created.</p>
            )}
            {snapshot.roles.map(role => (
              <button
                type="button"
                key={role.id}
                className="nac-role-option"
                aria-current={role.id === selectedRoleId ? 'true' : undefined}
                onClick={() => setSelectedRoleId(role.id)}
              >
                <span className="nac-role-mark" aria-hidden="true">
                  {role.name.slice(0, 1).toUpperCase()}
                </span>
                <span>
                  <strong>{role.name}</strong>
                  <small>
                    {role.permissions.length} permissions · {role.assignments.length} people
                  </small>
                </span>
                {role.isSystem && <span className="nac-badge">System</span>}
              </button>
            ))}
          </aside>

          <main className="nac-role-detail">
            {!selectedRole ? (
              <div className="nac-empty-detail">
                <h2>Select a role</h2>
                <p>Choose a role to review its permissions and assignments.</p>
              </div>
            ) : (
              <>
                <header className="nac-detail-header">
                  <div>
                    <div className="nac-title-line">
                      <h2>{selectedRole.name}</h2>
                      {selectedRole.isSystem && (
                        <span className="nac-badge">Protected system role</span>
                      )}
                    </div>
                    <p>{selectedRole.description || 'No description provided.'}</p>
                  </div>
                  {canManage && !selectedRole.isSystem && (
                    <div className="nac-actions">
                      <button
                        type="button"
                        className="nac-button nac-button-secondary"
                        onClick={() => setEditingRole(selectedRole)}
                      >
                        Edit
                      </button>
                      <button
                        type="button"
                        className="nac-button nac-button-danger"
                        onClick={() => void deleteSelectedRole()}
                      >
                        Delete
                      </button>
                    </div>
                  )}
                </header>

                <section className="nac-section">
                  <div className="nac-section-heading">
                    <div>
                      <h3>Permissions</h3>
                      <p>Capabilities granted by this role.</p>
                    </div>
                  </div>
                  <div className="nac-chip-list">
                    {selectedRole.permissions.length === 0 && (
                      <span className="nac-muted">No permissions assigned.</span>
                    )}
                    {selectedRole.permissions.map(permission => (
                      <span className="nac-chip" key={permission.key}>
                        {permission.key}
                      </span>
                    ))}
                  </div>
                </section>

                <section className="nac-section">
                  <div className="nac-section-heading">
                    <div>
                      <h3>People</h3>
                      <p>Users who receive this role directly.</p>
                    </div>
                    {canManage && !selectedRole.isSystem && (
                      <button
                        type="button"
                        className="nac-button nac-button-secondary"
                        onClick={() => setAssigning(true)}
                      >
                        Add person
                      </button>
                    )}
                  </div>
                  <div className="nac-people-list">
                    {selectedRole.assignments.length === 0 && (
                      <p className="nac-muted">Nobody has this role yet.</p>
                    )}
                    {selectedRole.assignments.map(assignment => (
                      <article key={assignment.id} className="nac-person-row">
                        <span className="nac-avatar">
                          {principalName(assignment.principal).slice(0, 1).toUpperCase()}
                        </span>
                        <span>
                          <strong>{principalName(assignment.principal)}</strong>
                          <small>{assignment.principal.email || assignment.principal.id}</small>
                        </span>
                        {assignment.principal.isSuperAdmin && (
                          <span className="nac-badge">Root</span>
                        )}
                        {canManage && !selectedRole.isSystem && (
                          <button
                            type="button"
                            className="nac-text-button nac-danger-text"
                            disabled={busy}
                            onClick={() =>
                              void run(async () =>
                                replaceRole(
                                  await adapter.revokeRole(
                                    selectedRole.id,
                                    assignment.principal.id,
                                  ),
                                ),
                              )
                            }
                          >
                            Remove
                          </button>
                        )}
                      </article>
                    ))}
                  </div>
                </section>
              </>
            )}
          </main>
        </div>
      ) : (
        <div className="nac-catalog">
          {permissionGroups(snapshot.permissions).map(([namespace, permissions]) => (
            <section key={namespace} className="nac-catalog-group">
              <header>
                <h2>{namespace}</h2>
                <span>{permissions.length}</span>
              </header>
              {permissions.map(permission => (
                <article key={permission.key}>
                  <code>{permission.key}</code>
                  <p>{permission.description || 'No description provided.'}</p>
                </article>
              ))}
            </section>
          ))}
        </div>
      )}

      {editingRole && (
        <RoleEditor
          role={editingRole === 'new' ? undefined : editingRole}
          permissions={snapshot.permissions.filter(permission => permission.key !== 'platform.*')}
          busy={busy}
          onCancel={() => setEditingRole(null)}
          onSave={saveRole}
        />
      )}
      {assigning && selectedRole && (
        <AssignmentPicker
          busy={busy}
          search={searchPrincipals}
          onClose={() => setAssigning(false)}
          onError={reportError}
          assign={async principal => {
            const assigned = await run(async () =>
              replaceRole(await adapter.assignRole(selectedRole.id, principal.id)),
            )
            if (assigned) setAssigning(false)
          }}
        />
      )}
    </section>
  )
}
