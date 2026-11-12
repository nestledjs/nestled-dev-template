import { describe, expect, it } from 'vitest'
import { getFilterableFieldNames, parseUrlFilters } from './filter-fields'
import type { FilterModel } from './filter-input'

const organizationModel: FilterModel = {
  name: 'Organization',
  fields: [
    { name: 'id', type: 'String', kind: 'scalar' },
    { name: 'name', type: 'String', kind: 'scalar' },
    { name: 'status', type: 'OrganizationStatus', kind: 'enum' },
    { name: 'categories', type: 'OrganizationCategory', kind: 'enum', isList: true },
  ],
}

const userModel: FilterModel = {
  name: 'User',
  fields: [
    { name: 'id', type: 'String', kind: 'scalar' },
    { name: 'name', type: 'String', kind: 'scalar' },
    { name: 'isActive', type: 'Boolean', kind: 'scalar' },
    { name: 'status', type: 'UserStatus', kind: 'enum' },
    { name: 'roles', type: 'UserRole', kind: 'enum', isList: true },
    { name: 'tags', type: 'String', kind: 'scalar', isList: true },
    { name: 'scores', type: 'Int', kind: 'scalar', isList: true },
    { name: 'createdAt', type: 'DateTime', kind: 'scalar' },
    { name: 'organizationId', type: 'String', kind: 'scalar' },
    {
      name: 'organization',
      type: 'Organization',
      kind: 'object',
      relationName: 'OrganizationToUser',
      relationFromFields: ['organizationId'],
    },
    { name: 'posts', type: 'Post', kind: 'object', relationName: 'PostToUser', isList: true },
  ],
}

const databaseModels = [userModel, organizationModel]

describe('getFilterableFieldNames', () => {
  it('offers single-valued scalars, enums, to-one relations and related enums', () => {
    expect(getFilterableFieldNames(userModel, databaseModels)).toEqual([
      'isActive',
      'status',
      'organization',
      'organization.status',
    ])
  })

  it('never offers a list-valued column, on the model or on a relation', () => {
    const names = getFilterableFieldNames(userModel, databaseModels)
    for (const listField of ['roles', 'tags', 'scores', 'posts', 'organization.categories']) {
      expect(names).not.toContain(listField)
    }
  })

  it('returns nothing without a model', () => {
    expect(getFilterableFieldNames(undefined, databaseModels)).toEqual([])
  })
})

describe('parseUrlFilters', () => {
  const parse = (query: string) => parseUrlFilters(userModel, new URLSearchParams(query))

  it('maps a foreign key onto its relation and keeps own columns', () => {
    expect(parse('organizationId=org-1&isActive=true&status=ACTIVE')).toEqual({
      organization: { id: 'org-1' },
      isActive: 'true',
      status: 'ACTIVE',
    })
  })

  it('drops parameters naming a list-valued column', () => {
    expect(parse('roles=ADMIN&tags=x&scores=3&isActive=true')).toEqual({ isActive: 'true' })
  })

  it('drops paging, search, sort, relations and unknown names', () => {
    expect(parse('page=2&search=ada&sort=name&posts=p1&organization=org-1&nope=1')).toEqual({})
  })

  it('returns nothing without a model', () => {
    expect(parseUrlFilters(undefined, new URLSearchParams('isActive=true'))).toEqual({})
  })
})
