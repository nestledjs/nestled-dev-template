import { describe, expect, it } from 'vitest'
import { isOperatorShape, toFilterInput, type FilterModel } from './filter-input'

const organizationModel: FilterModel = {
  name: 'Organization',
  fields: [
    { name: 'id', type: 'String', kind: 'scalar' },
    { name: 'name', type: 'String', kind: 'scalar' },
    { name: 'status', type: 'OrganizationStatus', kind: 'enum' },
    { name: 'owner', type: 'User', kind: 'object', relationName: 'OrganizationOwner' },
  ],
}

const teamModel: FilterModel = {
  name: 'Team',
  fields: [{ name: 'id', type: 'Int', kind: 'scalar' }],
}

const userModel: FilterModel = {
  name: 'User',
  fields: [
    { name: 'id', type: 'String', kind: 'scalar' },
    { name: 'name', type: 'String', kind: 'scalar' },
    { name: 'isActive', type: 'Boolean', kind: 'scalar' },
    { name: 'status', type: 'UserStatus', kind: 'enum' },
    { name: 'failedLoginCount', type: 'Int', kind: 'scalar' },
    { name: 'balance', type: 'Decimal', kind: 'scalar' },
    { name: 'createdAt', type: 'DateTime', kind: 'scalar' },
    { name: 'settings', type: 'Json', kind: 'scalar' },
    { name: 'tags', type: 'String', kind: 'scalar', isList: true },
    { name: 'organizationId', type: 'String', kind: 'scalar' },
    {
      name: 'organization',
      type: 'Organization',
      kind: 'object',
      relationName: 'OrganizationToUser',
      relationFromFields: ['organizationId'],
    },
    // A relation whose foreign key is not exposed as a column on this model.
    {
      name: 'manager',
      type: 'User',
      kind: 'object',
      relationName: 'UserManager',
      relationFromFields: ['managerId'],
    },
    { name: 'teamId', type: 'Int', kind: 'scalar' },
    {
      name: 'team',
      type: 'Team',
      kind: 'object',
      relationName: 'TeamToUser',
      relationFromFields: ['teamId'],
    },
    {
      name: 'posts',
      type: 'Post',
      kind: 'object',
      relationName: 'PostToUser',
      isList: true,
    },
  ],
}

const databaseModels = [userModel, organizationModel, teamModel]

const convert = (filters: Record<string, unknown> | undefined) =>
  toFilterInput(userModel, filters, databaseModels)

describe('toFilterInput', () => {
  it.each<[string, Record<string, unknown>, Record<string, unknown> | undefined]>([
    ['text → contains', { name: 'ada' }, { name: { contains: 'ada' } }],
    ['boolean → equals', { isActive: true }, { isActive: { equals: true } }],
    ['boolean false → equals', { isActive: false }, { isActive: { equals: false } }],
    ['boolean from a URL string', { isActive: 'false' }, { isActive: { equals: false } }],
    ['enum → equals', { status: 'ACTIVE' }, { status: { equals: 'ACTIVE' } }],
    [
      'enum list → in',
      { status: ['ACTIVE', 'DISABLED'] },
      { status: { in: ['ACTIVE', 'DISABLED'] } },
    ],
    ['int from a URL string', { failedLoginCount: '3' }, { failedLoginCount: { equals: 3 } }],
    ['decimal number', { balance: 2.5 }, { balance: { equals: 2.5 } }],
    [
      'date range passes through',
      { createdAt: { gte: '2024-01-01T00:00:00.000Z', lte: '2024-01-31T23:59:59.999Z' } },
      { createdAt: { gte: '2024-01-01T00:00:00.000Z', lte: '2024-01-31T23:59:59.999Z' } },
    ],
    [
      'number range passes through',
      { failedLoginCount: { gte: 1 } },
      { failedLoginCount: { gte: 1 } },
    ],
    [
      'range drops an empty bound',
      { failedLoginCount: { gte: 1, lte: undefined } },
      { failedLoginCount: { gte: 1 } },
    ],
    ['bare date → equals', { createdAt: '2024-01-01' }, { createdAt: { equals: '2024-01-01' } }],
    [
      'relation id → foreign key',
      { organization: { id: 'org-1' } },
      { organizationId: { equals: 'org-1' } },
    ],
    [
      'bare relation id → foreign key',
      { organization: 'org-1' },
      { organizationId: { equals: 'org-1' } },
    ],
    [
      'relation id without an exposed foreign key → relation filter',
      { manager: { id: 'user-2' } },
      { manager: { id: { equals: 'user-2' } } },
    ],
    ['integer foreign key is coerced', { team: { id: '7' } }, { teamId: { equals: 7 } }],
    [
      'related enum → relation filter',
      { organization: { status: 'ACTIVE' } },
      { organization: { status: { equals: 'ACTIVE' } } },
    ],
    [
      'relation id and related enum together',
      { organization: { id: 'org-1', status: 'ACTIVE' } },
      { organizationId: { equals: 'org-1' }, organization: { status: { equals: 'ACTIVE' } } },
    ],
    [
      'explicit foreign key filter is not overwritten by the relation id',
      { organizationId: { equals: 'org-1' }, organization: { id: 'org-2' } },
      { organizationId: { equals: 'org-1' }, organization: { id: { equals: 'org-2' } } },
    ],
    [
      'relation is/isNot passes through',
      { organization: { is: { name: { contains: 'Acme' } } } },
      { organization: { is: { name: { contains: 'Acme' } } } },
    ],
    [
      'list relation operators pass through',
      { posts: { some: { id: { equals: 'p1' } } } },
      { posts: { some: { id: { equals: 'p1' } } } },
    ],
    ['list relation without operators is dropped', { posts: 'p1' }, undefined],
    [
      'explicit null and empty-string operands are kept',
      { organizationId: { equals: null }, name: { not: null }, status: { equals: '' } },
      { organizationId: { equals: null }, name: { not: null }, status: { equals: '' } },
    ],
    ['relation is: null is kept', { organization: { is: null } }, { organization: { is: null } }],
    [
      'relation isNot: {} is kept',
      { organization: { isNot: {} } },
      { organization: { isNot: {} } },
    ],
    [
      'already-typed nested relation filter is kept',
      { team: { members: { some: { id: { equals: 'm1' } } } } },
      { team: { members: { some: { id: { equals: 'm1' } } } } },
    ],
    [
      'nested relation filter on a related relation field is kept',
      { organization: { owner: { id: { equals: 'u1' } } } },
      { organization: { owner: { id: { equals: 'u1' } } } },
    ],
    [
      'non-operator object on a related scalar is dropped',
      { organization: { name: { foo: 'bar' } } },
      undefined,
    ],
    [
      'logical operators pass through',
      { OR: [{ name: { contains: 'a' } }, { name: { contains: 'b' } }] },
      { OR: [{ name: { contains: 'a' } }, { name: { contains: 'b' } }] },
    ],
    ['unknown keys pass through', { custom: { equals: 1 } }, { custom: { equals: 1 } }],
    ['Json columns are not filterable', { settings: 'x' }, undefined],
    ['scalar list columns are not filterable', { tags: 'x' }, undefined],
    ['non-operator object on a scalar is dropped', { name: { foo: 'bar' } }, undefined],
    ['non-numeric string on a number column is dropped', { failedLoginCount: 'abc' }, undefined],
    [
      'empty values are dropped',
      { name: '', isActive: undefined, status: null, createdAt: {}, organization: {}, tags: [] },
      undefined,
    ],
    ['empty related value is dropped', { organization: { id: '', status: undefined } }, undefined],
  ])('%s', (_label, filters, expected) => {
    expect(convert(filters)).toEqual(expected)
  })

  it('returns undefined for no filters or no model fields', () => {
    expect(convert(undefined)).toBeUndefined()
    expect(convert({})).toBeUndefined()
    expect(toFilterInput(undefined, { name: { equals: 'x' } })).toEqual({ name: { equals: 'x' } })
  })

  it('converts the URL filter state the list page builds for ?organizationId=…', () => {
    // AdminDataListPage maps a foreign-key URL param onto its relation for the filter controls.
    expect(convert({ organization: { id: 'org-1' }, isActive: 'true' })).toEqual({
      organizationId: { equals: 'org-1' },
      isActive: { equals: true },
    })
  })

  it.each<[string, Record<string, unknown>]>([
    ['text', { name: { contains: 'ada' } }],
    ['equals', { isActive: { equals: true }, status: { equals: 'ACTIVE' } }],
    ['in', { status: { in: ['ACTIVE'] } }],
    ['not', { status: { not: 'DISABLED' } }],
    ['startsWith/endsWith', { name: { startsWith: 'a', endsWith: 'z' } }],
    ['foreign key', { organizationId: { equals: 'org-1' } }],
    ['relation', { organization: { id: { equals: 'org-1' }, status: { equals: 'ACTIVE' } } }],
    ['relation is', { organization: { is: { status: { equals: 'ACTIVE' } } } }],
    ['range', { createdAt: { gt: '2024-01-01', lt: '2024-02-01' } }],
  ])('passes already-converted %s filters through unchanged', (_label, filters) => {
    expect(convert(filters)).toEqual(filters)
  })

  it('is idempotent over its own output', () => {
    const once = convert({
      name: 'ada',
      isActive: true,
      status: 'ACTIVE',
      createdAt: { gte: '2024-01-01T00:00:00.000Z' },
      organization: { id: 'org-1', status: 'ACTIVE' },
      manager: { id: 'user-2' },
    })
    expect(convert(once)).toEqual(once)
  })

  it('does not mutate its input', () => {
    const filters = { organization: { id: 'org-1', status: 'ACTIVE' }, name: 'ada' }
    const snapshot = structuredClone(filters)
    convert(filters)
    expect(filters).toEqual(snapshot)
  })
})

describe('isOperatorShape', () => {
  it.each<[unknown, boolean]>([
    [{ equals: 1 }, true],
    [{ gte: 1, lte: 2 }, true],
    [{ is: {} }, true],
    [{ id: 'x' }, false],
    [{ equals: 1, id: 'x' }, false],
    [{}, false],
    [[], false],
    ['x', false],
    [null, false],
  ])('%j → %s', (value, expected) => {
    expect(isOperatorShape(value)).toBe(expected)
  })
})
