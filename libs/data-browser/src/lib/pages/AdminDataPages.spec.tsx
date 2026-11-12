import React from 'react'
import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { AdminDataProvider } from '../context/AdminDataContext'
import { AdminDataCreatePage } from './AdminDataCreatePage'
import { AdminDataEditPage } from './AdminDataEditPage'
import { AdminDataListPage } from './AdminDataListPage'

const navigate = vi.fn()
let routeParams: Record<string, string | undefined> = {}
let routeSearchParams = new URLSearchParams()
const useQuery = vi.fn()
const useMutation = vi.fn()

vi.mock('react-router', () => ({
  Link: ({ to, children, ...props }: any) => (
    <a href={to} {...props}>
      {children}
    </a>
  ),
  useNavigate: () => navigate,
  useParams: () => routeParams,
  useSearchParams: () => [routeSearchParams],
}))

vi.mock('@apollo/client/react', () => ({
  useQuery: (...args: any[]) => useQuery(...args),
  useMutation: (...args: any[]) => useMutation(...args),
  useLazyQuery: () => [vi.fn()],
}))

vi.mock('@nestledjs/shared-components', () => ({
  DataTable: ({ data, fields, setSort, setSkip }: any) => (
    <div>
      <div data-testid="data-table">{`${data.length} rows / ${fields.join(',')}`}</div>
      <button onClick={() => setSort({ orderBy: 'name', orderDirection: 'asc' })}>
        Sort by name
      </button>
      <button onClick={() => setSkip(20)}>Next page</button>
    </div>
  ),
  ErrorBoundary: ({ error }: any) => <div>{error.message}</div>,
}))

vi.mock('@nestledjs/forms', () => ({
  Form: ({ id, submit, disabled, defaultValues }: any) => (
    <form
      aria-label={id}
      onSubmit={event => {
        event.preventDefault()
        void submit({ name: 'Ada', status: 'ACTIVE' })
      }}
    >
      <output data-testid={`${id}-defaults`}>{JSON.stringify(defaultValues)}</output>
      <button type="submit" disabled={disabled}>
        Submit Form
      </button>
    </form>
  ),
}))

vi.mock('../utils/graphql-utils', async importOriginal => {
  const actual = await importOriginal<typeof import('../utils/graphql-utils')>()
  return {
    ...actual,
    buildFormFields: vi.fn(() => [{ key: 'name', type: 'Text' }]),
    cleanFormInput: vi.fn((input: Record<string, unknown>) => input),
    getAdminDocuments: vi.fn(() => ({
      listQuery: { kind: 'Document', definitions: [] },
      query: { kind: 'Document', definitions: [] },
      create: { kind: 'Document', definitions: [] },
      update: { kind: 'Document', definitions: [] },
      delete: { kind: 'Document', definitions: [] },
    })),
  }
})

const userModel = {
  name: 'User',
  pluralName: 'Users',
  pluralModelPropertyName: 'users',
  fields: [
    { name: 'id', type: 'String', isId: true },
    { name: 'name', type: 'String' },
    { name: 'email', type: 'String' },
    { name: 'active', type: 'Boolean' },
    { name: 'status', type: 'UserStatus', kind: 'enum' },
    {
      name: 'organization',
      type: 'Organization',
      relationName: 'OrganizationToUser',
      relationFromFields: ['organizationId'],
    },
  ],
}

const organizationModel = {
  name: 'Organization',
  pluralName: 'Organizations',
  fields: [
    { name: 'id', type: 'String', isId: true },
    { name: 'name', type: 'String' },
    { name: 'status', type: 'OrganizationStatus', kind: 'enum' },
  ],
}

// The same models with list-valued columns, which the generated filter inputs have no field for.
const userModelWithLists = {
  ...userModel,
  fields: [
    ...userModel.fields,
    { name: 'roles', type: 'UserRole', kind: 'enum', isList: true },
    { name: 'tags', type: 'String', isList: true },
  ],
}

const organizationModelWithLists = {
  ...organizationModel,
  fields: [
    ...organizationModel.fields,
    { name: 'categories', type: 'OrganizationCategory', kind: 'enum', isList: true },
  ],
}

const sdk = {
  __AdminUsersDocument: { kind: 'Document', definitions: [] },
  UserStatus: { ACTIVE: 'ACTIVE', DISABLED: 'DISABLED' },
  OrganizationStatus: { ACTIVE: 'ACTIVE' },
  UserRole: { ADMIN: 'ADMIN', MEMBER: 'MEMBER' },
  OrganizationCategory: { PARTNER: 'PARTNER' },
}

function renderWithProvider(
  ui: React.ReactElement,
  databaseModels: any[] = [userModel, organizationModel],
) {
  return render(
    <AdminDataProvider
      sdk={sdk}
      databaseModels={databaseModels}
      basePath="/admin/data"
      formTheme={{}}
    >
      {ui}
    </AdminDataProvider>,
  )
}

/** Filters sent by the most recent list query (the relation filter control runs its own query). */
function lastListQueryFilters() {
  const listCalls = useQuery.mock.calls.filter(
    ([, options]) => options?.variables?.input?.orderBy !== undefined,
  )
  return listCalls[listCalls.length - 1]?.[1].variables.input.filters
}

describe('admin data pages', () => {
  beforeEach(() => {
    vi.useRealTimers()
    vi.clearAllMocks()
    globalThis.scrollTo = vi.fn()
    navigate.mockReset()
    routeParams = {}
    routeSearchParams = new URLSearchParams()
    useQuery.mockReturnValue({
      data: {
        users: [{ id: 'user-1', name: 'Ada', email: 'ada@example.com' }],
        counters: { total: 1 },
      },
      loading: false,
      error: null,
    })
    useMutation.mockReturnValue([vi.fn().mockResolvedValue({ data: {} })])
    localStorage.clear()
  })

  it('renders list data and lets admins change table controls', async () => {
    routeParams = { dataTypePlural: 'users' }
    routeSearchParams = new URLSearchParams('organizationId=org-1')

    renderWithProvider(<AdminDataListPage />)

    expect(await screen.findByTestId('data-table')).toHaveTextContent('1 rows')
    expect(screen.getByRole('link', { name: 'Create New' })).toHaveAttribute(
      'href',
      '/admin/data/user/create',
    )

    fireEvent.click(screen.getByRole('button', { name: 'Columns' }))
    fireEvent.click(screen.getByRole('button', { name: 'Select All' }))
    fireEvent.click(screen.getByRole('button', { name: 'Sort by name' }))
    fireEvent.click(screen.getByRole('button', { name: 'Next page' }))

    await waitFor(() => expect(useQuery).toHaveBeenCalled())
  })

  it('sends URL foreign-key filters to the list query in operator shape', async () => {
    routeParams = { dataTypePlural: 'users' }
    routeSearchParams = new URLSearchParams('organizationId=org-1&active=true')

    renderWithProvider(<AdminDataListPage />)

    // The list query's filters must match the API's typed UserFilterInput, not the UI state
    // (`{ organization: { id } }`, `{ active: 'true' }`) that the filter controls work with.
    await waitFor(() =>
      expect(lastListQueryFilters()).toEqual({
        organization: { id: { equals: 'org-1' } },
        active: { equals: true },
      }),
    )
  })

  it('sends filter panel selections to the list query in operator shape', async () => {
    routeParams = { dataTypePlural: 'users' }

    renderWithProvider(<AdminDataListPage />)

    fireEvent.click(await screen.findByRole('button', { name: /Filters/ }))
    fireEvent.change(screen.getByLabelText('Active'), { target: { value: 'false' } })
    fireEvent.change(screen.getByLabelText('Status'), { target: { value: 'ACTIVE' } })

    await waitFor(() =>
      expect(lastListQueryFilters()).toEqual({
        active: { equals: false },
        status: { equals: 'ACTIVE' },
      }),
    )
  })

  it('does not offer list-valued columns in the filter panel', async () => {
    routeParams = { dataTypePlural: 'users' }

    renderWithProvider(<AdminDataListPage />, [userModelWithLists, organizationModelWithLists])

    fireEvent.click(await screen.findByRole('button', { name: /Filters/ }))
    // Single-valued enums, own and related, are offered...
    expect(screen.getByLabelText('Status')).toBeInTheDocument()
    expect(screen.getByLabelText('Organization Status')).toBeInTheDocument()
    // ...list-valued ones are not: UserFilterInput has no field to send them in.
    expect(screen.queryByLabelText('Roles')).not.toBeInTheDocument()
    expect(screen.queryByLabelText('Tags')).not.toBeInTheDocument()
    expect(screen.queryByLabelText('Organization Categories')).not.toBeInTheDocument()
  })

  it('drops URL parameters naming a list-valued column', async () => {
    routeParams = { dataTypePlural: 'users' }
    routeSearchParams = new URLSearchParams('roles=ADMIN&tags=x&active=true')

    renderWithProvider(<AdminDataListPage />, [userModelWithLists, organizationModelWithLists])

    await waitFor(() => expect(lastListQueryFilters()).toEqual({ active: { equals: true } }))
    // Not held as filter state either, so the panel does not count a filter it cannot send.
    expect(screen.getByRole('button', { name: /Filters/ })).toHaveTextContent(/^Filters1$/)
  })

  it('shows list page errors for invalid models and missing documents', () => {
    routeParams = { dataTypePlural: 'missing-models' }
    renderWithProvider(<AdminDataListPage />)
    expect(screen.getByText('Invalid Data Type')).toBeInTheDocument()
  })

  it('creates records and shows mutation failures', async () => {
    routeParams = { dataType: 'user' }
    const createMutation = vi
      .fn()
      .mockResolvedValueOnce({ errors: [{ message: 'Name is required' }] })
      .mockResolvedValueOnce({ data: { createUser: { id: 'user-1' } } })
    useMutation.mockReturnValue([createMutation])

    renderWithProvider(<AdminDataCreatePage />)

    fireEvent.click(screen.getByRole('button', { name: 'Submit Form' }))
    expect(await screen.findByText('Name is required')).toBeInTheDocument()

    fireEvent.click(screen.getByRole('button', { name: 'Submit Form' }))
    expect(await screen.findByText('User created successfully!')).toBeInTheDocument()
  })

  it('rejects invalid create and edit routes before running mutations', () => {
    routeParams = { dataType: 'not-valid' }
    renderWithProvider(<AdminDataCreatePage />)
    expect(screen.getByText('Unauthorized')).toBeInTheDocument()

    routeParams = { dataType: 'user', id: '../bad' }
    renderWithProvider(<AdminDataEditPage />)
    expect(screen.getAllByText('Unauthorized')).toHaveLength(2)
  })

  it('loads an edit form with sanitized initial values and updates records', async () => {
    routeParams = { dataType: 'user', id: 'user-1' }
    const refetch = vi.fn().mockResolvedValue({})
    const updateMutation = vi.fn().mockResolvedValue({ data: { updateUser: { id: 'user-1' } } })
    const deleteMutation = vi.fn()
    useQuery.mockReturnValue({
      data: {
        user: {
          id: 'user-1',
          name: 'Ada',
          email: { id: 'email-1' },
          active: null,
          status: 'ACTIVE',
          organizationId: undefined,
          organization: { id: 'org-1' },
        },
      },
      loading: false,
      error: null,
      refetch,
    })
    useMutation.mockReturnValueOnce([updateMutation]).mockReturnValueOnce([deleteMutation])

    renderWithProvider(<AdminDataEditPage />)

    expect(await screen.findByRole('heading', { name: 'Edit User' })).toBeInTheDocument()
    expect(screen.getByTestId('edit-user-form-defaults')).toHaveTextContent(
      JSON.stringify({
        id: 'user-1',
        name: 'Ada',
        email: 'email-1',
        active: false,
        status: 'ACTIVE',
        organizationId: 'org-1',
      }),
    )

    fireEvent.click(screen.getByRole('button', { name: 'Submit Form' }))

    expect(await screen.findByText('User updated successfully!')).toBeInTheDocument()
    expect(updateMutation).toHaveBeenCalledWith({
      variables: {
        input: { name: 'Ada', status: 'ACTIVE' },
        userId: 'user-1',
      },
    })
    expect(refetch).toHaveBeenCalled()
  })

  it('shows edit mutation errors without navigating away', async () => {
    routeParams = { dataType: 'user', id: 'user-1' }
    const updateMutation = vi.fn().mockResolvedValue({ errors: [{ message: 'Email is invalid' }] })
    useQuery.mockReturnValue({
      data: { user: { id: 'user-1', name: 'Ada', active: true } },
      loading: false,
      error: null,
      refetch: vi.fn(),
    })
    useMutation.mockReturnValueOnce([updateMutation]).mockReturnValueOnce([vi.fn()])

    renderWithProvider(<AdminDataEditPage />)

    fireEvent.click(await screen.findByRole('button', { name: 'Submit Form' }))

    expect(await screen.findByText('Email is invalid')).toBeInTheDocument()
    expect(navigate).not.toHaveBeenCalled()
  })

  it('deletes records after confirmation and returns to the list', async () => {
    routeParams = { dataType: 'user', id: 'user-1' }
    const deleteMutation = vi.fn().mockResolvedValue({ data: { deleteUser: { id: 'user-1' } } })
    useQuery.mockReturnValue({
      data: { user: { id: 'user-1', name: 'Ada', active: true } },
      loading: false,
      error: null,
      refetch: vi.fn(),
    })
    useMutation.mockReturnValue([deleteMutation])

    renderWithProvider(<AdminDataEditPage />)

    fireEvent.click(await screen.findByRole('button', { name: 'Delete' }))
    expect(
      screen.getByText('Are you sure you want to delete this user? This action cannot be undone.'),
    ).toBeInTheDocument()

    fireEvent.click(screen.getAllByRole('button', { name: 'Delete' })[1])
    expect(await screen.findByText('User deleted successfully!')).toBeInTheDocument()
    expect(deleteMutation).toHaveBeenCalledWith({ variables: { userId: 'user-1' } })

    await waitFor(() => expect(navigate).toHaveBeenCalledWith('/admin/data/users'), {
      timeout: 2000,
    })
  })

  it('renders edit loading, query error, not-found, and schema-error states', async () => {
    routeParams = { dataType: 'user', id: 'user-1' }
    useQuery.mockReturnValue({
      data: null,
      loading: true,
      error: null,
      refetch: vi.fn(),
    })
    renderWithProvider(<AdminDataEditPage />)
    expect(screen.getByText('Loading...')).toBeInTheDocument()

    useQuery.mockReturnValue({
      data: null,
      loading: false,
      error: new Error('Network unavailable'),
      refetch: vi.fn(),
    })
    renderWithProvider(<AdminDataEditPage />)
    expect(screen.getByText('Error Loading Data')).toBeInTheDocument()
    fireEvent.click(screen.getByRole('button', { name: 'Try Again' }))

    useQuery.mockReturnValue({
      data: { user: null },
      loading: false,
      error: null,
      refetch: vi.fn(),
    })
    renderWithProvider(<AdminDataEditPage />)
    expect(screen.getByText('Not Found')).toBeInTheDocument()

    const graphqlUtils = await import('../utils/graphql-utils')
    vi.mocked(graphqlUtils.getAdminDocuments).mockReturnValueOnce({
      listQuery: null,
      query: null,
      create: null,
      update: null,
      delete: null,
    } as any)
    renderWithProvider(<AdminDataEditPage />)
    expect(screen.getByText('GraphQL Schema Error')).toBeInTheDocument()
  })
})
